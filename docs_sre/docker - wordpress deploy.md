---
layout: page
title: docker - Implementar Wordpress
# permalink: /creative_code/
parent: SRE & SysAdmin
---

# Wordpress + docker

- [Instructivo](https://www.digitalocean.com/community/tutorials/how-to-install
  -wordpress-with-docker-compose-es)
- Sobre un servidor ya deployado y configurado, con docker, docker-compose, etc.

## Configuración server

```bash
# ssh y dependencias básicas
$ ssh ~/ruta/key root@xx.xx.xx.xxx
$ apt-get update
$ apt-get upgrade
$ apt-get install mc zip gzip tar ccze fail2ban ufw
$ apt-get remove apache2 nginx
$ adduser diego
$ usermod -aG sudo diego
$ rsync --archive --chown=diego:diego ~/.ssh /home/diego/
$ nano /etc/ssh/sshd_config
    Port 1234
    PermitRootLogin no
    AllowUsers diego
    PasswordAuthentication no
    PermitEmptyPasswords no
$ service ssh restart
# Si no lo hice al momento de dar de alta el server, agrego mi llave ssh pública
$ nano ~/.ssh/authorized_keys
```

### ssh

```bash
# En el equipo de trabajo
$ nano ~/.ssh/config
## server
    Host server
    HostName xx.xx.xx.xxx
    Port 1234
    User diego
    IdentityFile ~/ruta/key
# Desde otra instancia de la terminal para verificar login (antes de cerrar la que está en ejecución)
$ ssh server
```

### Setup firewall

```bash
# Para no user el puerto estándar 22 entre otras cosas
$ ufw status
Status: inactive
$ ufw allow http
$ ufw allow https
$ ufw allow 1234
$ ufw enable
```

### docker & compose plugin

```bash
# Dependencias
$ sudo apt update
$ sudo apt install apt-transport-https ca-certificates curl software-properties-common
# Repositorio y key
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
# Instalar
$ sudo apt install docker-ce docker-compose-plugin
# Ejecutar como root
$ sudo usermod -aG docker ${USER}
$ su - ${USER}
```

## Paso 1: configuración del servidor web

```bash
$ mkdir wordpress && cd wordpress
$ pwd
/home/diego/wordpress
$ mkdir nginx-conf
$ nano nginx-conf/nginx.conf
# Ver [ejemplo](nginx.conf), tener en cuenta que incluye 80 y 443
```

## Paso 2: variables de entorno

```bash
# Your database and WordPress application containers will need access to certain environment variables at runtime in order for your application data to persist and be accessible to your application.
$ pwd
~/wordpress
$ nano .env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_USER=your_wordpress_database_user
MYSQL_PASSWORD=your_wordpress_database_password
$ git init
$ nano .gitignore
.env
.git
docker-compose.yml
.dockerignore
```

## Paso 3: servicios con Docker Compose

```bash
# Ver / copiar [compose](docker-compose.yml)
$ pwd
~/wordpress
$ nano docker-compose.yml
```

## Paso 4: Run & SSL

```bash
$ docker-compose up -d
$ docker-compose ps
Output
  Name                 Command               State           Ports
-------------------------------------------------------------------------
certbot     certbot certonly --webroot ...   Exit 0
db          docker-entrypoint.sh --def ...   Up       3306/tcp, 33060/tcp
webserver   nginx -g daemon off;             Up       0.0.0.0:80->80/tcp
wordpress   docker-entrypoint.sh php-fpm     Up       9000/tcp
```

### Checks

```bash
# verificar que los certificados (staging) se hayan montado en el contenedor webserver
$ docker-compose exec webserver ls -la /etc/letsencrypt/live
# En el comando para certbot, modificar --staging por --force-renewal
$ nano docker-compose.yml
# Crear certificado
$ docker-compose up --force-recreate --no-deps certbot
```

## Paso 5: Actualizar configuración nginx

```bash
$ docker-compose stop webserver
$ curl -sSLo nginx-conf/options-ssl-nginx.conf https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf
# Con este comando se guardará estos parámetros en un archivo llamado options-ssl-nginx.conf, ubicado en el directorio nginx-conf.
$ cp nginx-conf/nginx.conf nginx-conf/nginx.conf.old
$ nano nginx-conf/nginx.conf
$ nano docker-compose.yml
$ docker-compose up -d --force-recreate --no-deps webserver
$ docker-compose ps
```

## Paso 6: Completar la instalación

[Interfaz web](https://your_domain)

### Paso 7: Renovar certificados

```bash
# Ver [ejemplo](scripts/ssl_renew.sh.example)
$ nano ssl_renew.sh
$ chmod +x ssl_renew.sh
$ sudo crontab -e
...
*/5 * * * * /home/sammy/wordpress/ssl_renew.sh >> /var/log/cron.log 2>&1
# Básicamente es lograr que se ejecute el script, se puede editar la periodicidad
$ tail -f /var/log/cron.log
# Si obtenemos algo como "Congratulations, all renewals succeeded, cambiamos el intervalo para que se ejecute diariamente
$ sudo crontab -e
...
0 12 * * * /home/sammy/wordpress/ssl_renew.sh >> /var/log/cron.log 2>&1
# Eliminamos entonces --dry-run
$ nano ssl_renew.sh
```
