# Sitio La Colifata en Wordpress + docker

## Servidor

### Setup inicial

```bash
$ apt-get update
$ apt-get upgrade
$ apt-get install mc zip gzip tar ccze fail2ban ufw
$ adduser diego
$ usermod -aG sudo diego
$ rsync --archive --chown=diego:diego ~/.ssh /home/diego/
$ nano /etc/ssh/sshd_config
    Port 183
    PermitRootLogin no
    AllowUsers diego
    PasswordAuthentication no
    PermitEmptyPasswords no
$ service ssh restart
```

### Login SSH

```bash
$ ssh -p 183 -i ~/ruta/key diego@45.79.84.157
$ ssh lacolifata
```

#### Configuración local ssh

```bash
$ nano ~/.ssh/config
    ## lacolifata
    Host lacolifata
    HostName 45.79.84.157
    Port 183
    User diego
    IdentityFile ~/ruta/key
```

### Setup firewall

```bash
$ ufw status
Status: inactive
$ ufw allow http
$ ufw allow https
$ ufw allow 183
$ ufw enable
```

### Cloudflare

A > pruebas.lacolifata.org  
A > www.pruebas.lacolifata.org

##

- instalar docker & docker-compose
- dar sudo a docker

```bash
$ git clone https://gitlab.com/coopares/wordpress-con-docker.git
$ cd wordpress-con-docker/
$ cp docker-compose.yml.example docker-compose.yml
$ cp .env.example .env
$ cp nginx-conf/nginx.conf.example nginx-conf/nginx.conf
$ nano .env
$ nano docker-compose.yml
$ nano
$ mkdir /var/www/lacolifata

$ docker-compose up -d
Creating db ... done
Creating wordpress ... done
Creating webserver ... done
Creating certbot   ... done

```
