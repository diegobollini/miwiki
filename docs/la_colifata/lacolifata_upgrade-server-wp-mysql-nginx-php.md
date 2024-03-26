# UPGRADE SO SERVER LA COLIFATA

## Backup

- [x] WP + SQL
- [x] nginx
- [x] php

## Nuevo Server Ubuntu 22.04

```bash
- $ ssh -i ~/.ssh/private_key root@64.xx.xxx.x
```

### Preparación base

```bash
$ apt update && apt upgrade -y
$ apt install mc zip gzip tar ccze fail2ban ufw git
$ dpkg-reconfigure tzdata

# Agregar user + sudoers
$ adduser diego
$ usermod -aG sudo diego
$ rsync --archive --chown=diego:diego ~/.ssh /home/diego/
$ sudo -l -U diego # para verificar que están OK los permisos sudo

# Configurar ssh, quitar acceso root, cambiar puerto, etc.
$ sudo passwd -l root # deshabilitar inicio de sesión con root
$ apt install openssh-server # por las dudas, debería estar instalado
$ nano /etc/ssh/sshd_config
Port 1234
PermitRootLogin no
AllowUsers diego
PasswordAuthentication no
PermitEmptyPasswords no
$ service ssh restart

## Setup firewall
$ ufw status
Status: inactive
# dependiendo de la necesidad puntual, usos del server, etc.
$ ufw default allow outgoing
$ ufw default deny incoming
$ ufw allow http
$ ufw allow https
$ ufw allow 1234 # para conexión ssh
$ ufw enable
```

### Apps: nginx, php, mysql

```bash
# instalar webserver
$ sudo apt remove apache2
$ sudo apt install nginx
# instalar y configurar mysql
$ sudo apt install mysql-server
$ sudo mysql_secure_installation
# instalar extensiones php
$ sudo add-apt-repository ppa:ondrej/php
$ sudo apt install php8.3 -y
$ php --version
PHP 8.3.4 (cli) (built: Mar 16 2024 08:40:08) (NTS)
$ sudo apt install php8.3-{mysql,gd,intl,soap,xml,xmlrpc,zip,common,cli,fpm,curl,mbstring,imagick}
$ php -m
```

## Restore nuevo droplet

- [x] preparar server
- [x] importar backup
- [x] copiar nginx
- [x] SSL

### Sitios Wordpress

```bash
# Subir backups
$ scp ~/proyectos/respaldo_lacolifata.tar.gz multiserver:~/
$ scp ~/proyectos/respaldo_vivalacolifata.tar.gz multiserver:~/
$ ssh multiserver
$ tar -xzvf respaldo_lacolifata.tar.gz
$ tar -xzvf respaldo_vivalacolifata.tar.gz
$ sudo cp -R vivalacolifata/ /var/www/
$ sudo cp -R lacolifata/ /var/www/
```

### SQL

Crear bases de datos:

```sql
-- $ sudo mysql
-- vivalacolifata
> CREATE DATABASE vivalacolifata DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
> CREATE USER 'vivalacolifata_user'@'localhost' IDENTIFIED BY 'xxxxxxxxxxxxxx';
> GRANT ALL ON vivalacolifata.* TO 'vivalacolifata_user'@'localhost';
-- lacolifata
> CREATE DATABASE lacolifata DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
> CREATE USER 'lacolifatadbuser'@'localhost' IDENTIFIED BY 'xxxxxxxxxx';
> GRANT ALL ON lacolifata.* TO 'lacolifatadbuser'@'localhost';
> FLUSH PRIVILEGES;
```

Restaurar backups:

```bash
$ mysql -u vivalacolifata_user -p vivalacolifata < ~/vivalacolifata.sql
$ mysql -u lacolifatadbuser -p lacolifata < ~/lacolifata.sql
```

### Carpetas y permisos

```bash
$ sudo chown -R www-data:www-data /var/www/vivalacolifata
$ sudo chown -R www-data:www-data /var/www/lacolifata
```

### Configuración nginx

```bash
$ sudo nano /etc/nginx/sites-available/vivalacolifata
$ sudo nano /etc/nginx/sites-available/lacolifata
$ sudo ln -s /etc/nginx/sites-available/vivalacolifata /etc/nginx/sites-enabled/
$ sudo ln -s /etc/nginx/sites-available/lacolifata /etc/nginx/sites-enabled/
$ sudo nginx -t
$ sudo systemctl reload nginx
```

## CERTBOT

```bash
$ sudo apt install certbot python3-certbot-nginx
$ sudo certbot --nginx -d vivalacolifata.org -d www.vivalacolifata.org
$ sudo certbot --nginx -d lacolifata.com.ar -d www.lacolifata.com.ar
```

### PHP

```bash
# crear usuarios
$ sudo groupadd vivalacolifata
$ sudo groupadd lacolifata
$ sudo useradd -g vivalacolifata -s /usr/sbin/nologin vivalacolifata
$ sudo useradd -g lacolifata -s /usr/sbin/nologin lacolifata
$ sudo usermod -a -G www-data vivalacolifata
$ sudo usermod -a -G www-data lacolifata
# crear archivos de configuración php
$ sudo nano /etc/php/8.3/fpm/pool.d/vivalacolifata.conf
$ sudo nano /etc/php/8.3/fpm/pool.d/lacolifata.conf
```

```php
[vivalacolifata]
user = vivalacolifata
group = www-data
listen = /var/run/php/php8.3-fpm-vivalacolifata.sock
listen.owner = vivalacolifata
listen.group = www-data
listen.mode = 0660
pm = ondemand
pm.max_children = 96
chdir = /
php_admin_value[error_log] = /var/log/php8.3-fpm-vivalacolifata-error.log
php_admin_flag[log_errors] = on

[lacolifata]
user = lacolifata
group = www-data
listen = /var/run/php/php8.3-fpm-lacolifata.sock
listen.owner = lacolifata
listen.group = www-data
listen.mode = 0660
pm = ondemand
pm.max_children = 96
chdir = /
php_admin_value[error_log] = /var/log/php8.3-fpm-lacolifata-error.log
php_admin_flag[log_errors] = on
```

```bash
$ sudo nano /etc/nginx/sites-available/vivalacolifata
$ sudo nano /etc/nginx/sites-available/lacolifata

# Por ejemplo:
# location ~ \.php$ {
#     include snippets/fastcgi-php.conf;
#     fastcgi_pass unix:/var/run/php/php8.3-fpm-vivalacolifata.sock;
#     # otras configuraciones...
# }
```

```bash
$ sudo systemctl restart php8.3-fpm
$ sudo systemctl restart nginx
```

### Fixes

```bash
# lacolifata
$ sudo find /var/www/lacolifata -type d -exec chmod 775 {} \;
$ sudo find /var/www/lacolifata -type f -exec chmod 664 {} \;
$ sudo chown -R lacolifata:www-data /var/www/lacolifata/
$ sudo nano /var/www/lacolifata/wp-config.php
define('FS_METHOD', 'direct');
# vivalacolifata
$ sudo find /var/www/vivalacolifata -type d -exec chmod 775 {} \;
$ sudo find /var/www/vivalacolifata -type f -exec chmod 664 {} \;
$ sudo chown -R vivalacolifata:www-data /var/www/vivalacolifata/
$ sudo nano /var/www/vivalacolifata/wp-config.php
define('FS_METHOD', 'direct');
```
