---
layout: page
parent: SRE & SysAdmin
title: Arbusta Tesauro
permalink: /arbusta_tesauro/
---

# Proyecto Tesauro

Para un posible proyecto con un cliente (Arbusta) se necesitaba implementar un tesauro\*, así que buscamos en internet y descubrimos un proyecto open source argentino [TemaTres-Vocabulary-Server].

_\* instrumento de control terminológico que permite convertir el lenguaje natural de los documentos en un lenguaje controlado, ya que representa, de manera unívoca, el contenido de estos, con el fin de servir tanto para la indización, como para la recuperación de los documentos._

- [Repositorio](https://github.com/tematres/TemaTres-Vocabulary-Server)
- [Instalación local con xampp](https://www.youtube.com/watch?v=oBObulM7HMg)

## Servidor

- DNS: tesauro.arbusta.net
- Server: Ubuntu 20.04, 1 vCPU, 1GB / 25GB Disk, ($6/mo)

### Preparación

```bash
# Local - SSH
$ ssh -i /.ssh/id_rsa root@68.183.122.253
# Server
$ apt update
$ apt upgrade
# Usando un script con configuraciones básicas
$ curl -L https://raw.githubusercontent.com/do-community/automated-setups/master/Ubuntu-20.04/initial_server_setup.sh -o /tmp/initial_setup.sh
$ bash /tmp/initial_setup.sh
$ exit
```

## Instalación

Wiki oficial:

- Unpack TemaTres in your web document root (i.e. /var/www/tematres/)
- Configure your database connection in TEMATRES_PATH/vocab/db.tematres.php
- Open your browser in your tematres path installation and run Install script .

```bash
# Configuración variables BD
$ cd /var/www
$ git clone https://github.com/tematres/TemaTres-Vocabulary-Server.git
$ cd TemaTres-Vocabulary-Server/vocab/
$ nano db.tematres.php
```

Variables a configurar y definir:

```php
/** Nombre de la base de datos Database name */
$DBCFG["DBName"]     = "arb_tesauro";

/** Nombre de usuario - login */
$DBCFG["DBLogin"]    = "user_tesauro";

/** Passwords */
$DBCFG["DBPass"] = "password";

// Use to define specific local path for common/include directory
    define('T3_ABSPATH', '/var/www/TemaTres-Vocabulary-Server/');
};
```

Intercambiando mensajes Diego (el creador de Tematres), me sugirió agregar estas líneas al archivo de configuración:

```bash
# Editar rutas en config
$ nano config.tematres.php
```

```php
<?php
define('T3_WEBPATH', 'https://tesauro.arbusta.net/common/');

if (!defined('T3_WEBPATH')) {
    define('T3_WEBPATH', getURLbase().'https://tesauro.arbusta.net/common/');
}
```

### BD: MYSQL

- [Guía de referencia](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04-es)
- [Usuarios](https://www.digitalocean.com/community/tutorials/crear-un-nuevo-usuario-y-otorgarle-permisos-en-mysql-es)
- [Bases](https://www.digitalocean.com/community/tutorials/how-to-create-and-manage-databases-in-mysql-and-mariadb-on-a-cloud-server)

```bash
# Instalar mysql
$ apt install mysql-server
$ mysql_secure_installation
$ sudo mysql
```

```sql
# Crear user y base
SELECT user,authentication_string,plugin,host FROM mysql.user;
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'password';
FLUSH PRIVILEGES;
CREATE USER 'user_tesauro'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON * . * TO 'user_tesauro'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE arb_tesauro;
SHOW DATABASES;
```

### Web Server: Apache2

- [Guía](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04-es)

```bash
$ apt install apache2
$ systemctl status apache2
#### Configurar hosts virtuales
$ cd /var/www/TemaTres-Vocabulary-Server/vocab
$ chown -R www-data:www-data /var/www/TemaTres-Vocabulary-Server
$ chmod -R 755 /var/www/TemaTres-Vocabulary-Server
$ nano /var/www/TemaTres-Vocabulary-Server/vocab/index.html
$ nano /etc/apache2/sites-available/tesauro.arbusta.net.conf
# Activar y crear links en sites-enabled
$ a2ensite tesauro.arbusta.net.conf
$ a2dissite 000-default.conf
$ apache2ctl configtest
```

A grandes rasgos, esta sería la info más importante de los archivos de configuración del site:

```conf
<VirtualHost *:80>
    ServerAdmin plataformas@arbusta.net
    ServerName tesauro.arbusta.net
    ServerAlias www.tesauro.arbusta.net
    DocumentRoot /var/www/TemaTres-Vocabulary-Server/
```

```conf
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerAdmin plataformas@arbusta.net
    ServerName tesauro.arbusta.net
    ServerAlias www.tesauro.arbusta.net
    DocumentRoot /var/www/TemaTres-Vocabulary-Server/
```

### PHP

- [Guía](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-20-04)

```bash
# Instalar php
$ apt install php libapache2-mod-php php-mysql
```

### SSL: Certbot

- [Guía](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-20-04-es)
- Configurar DNS en Cloudflare

```bash
# Instalar y ejecutar certbot
$ apt install certbot python3-certbot-apache
$ sudo certbot --apache
```

## Instalación Tesauro

Instaladas todas las herramientas, dependencias, etc., se ejecuta el [script de la herramienta](https://tesauro.arbusta.net/install.php). Luego el proceso es bastante intuitivo, se crea el primer user, etc.

### Opcional: phpmyadmin

```bash
$ apt-get install phpmyadmin
$ sudo -H nano /etc/apache2/apache2.conf
# Sumar esta línea: Include /etc/phpmyadmin/apache.conf
$ service apache2 restart
```
