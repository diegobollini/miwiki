# Viva La Colifata WP

DNS: <www.vivalacolifata.org>
IP: 104.131.114.139

```sql
mysql> SELECT option_value FROM wp_options WHERE option_name = 'siteurl';
```

```sql
mysql> UPDATE wp_options SET option_value = replace(option_value, 'https://www.vivalacolifata.org', 'https://vivalacolifata.org') WHERE option_name = 'home' OR option_name = 'siteurl';
mysql> UPDATE wp_posts SET post_content = replace(post_content, 'https://www.vivalacolifata.org', 'https://vivalacolifata.org');
mysql> UPDATE wp_posts SET guid = replace(guid, 'https://www.vivalacolifata.org', 'https://vivalacolifata.org');
mysql> UPDATE wp_postmeta SET meta_value = replace(meta_value,'https://www.vivalacolifata.org', 'https://vivalacolifata.org');


```

## MYSQL

CREATE DATABASE vivalacolifata DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE USER 'vivalacolifata_user'@'localhost' IDENTIFIED BY 'xxxxxxxxxxxxx';
GRANT ALL ON vivalacolifata.\* TO 'vivalacolifata_user'@'localhost';

## PHP

$ sudo apt install php-curl php-gd php-intl php-mbstring php-soap php-xml php-xmlrpc php-zip

Cuando se actualiza php hay que actualizar también la versión que estamos usando en nginx (en este caso para el sitio que ya está instalado)
$ ls -ls /var/run/php/
$ php -v
PHP 8.3.3-1+ubuntu20.04.1+deb.sury.org+1 (cli) (built: Feb 15 2024 18:38:21) (NTS)
$ sudo systemctl restart php8.3-fpm
$ sudo nano /etc/nginx/sites-available/lacolifata
$ sudo systemctl restart nginx.service

## Configuring Nginx

Aprovechando el sitio ya instalado, copiamos y editamos el archivo de nginx existente.

$ sudo cp lacolifata vivalacolifata
$ sudo nano vivalacolifata
$ sudo ln -s /etc/nginx/sites-available/vivalacolifata /etc/nginx/sites-enabled/vivalacolifata

## WP

cd /tmp
curl -LO https://wordpress.org/latest.tar.gz
tar xzvf latest.tar.gz
cp /tmp/wordpress/wp-config-sample.php /tmp/wordpress/wp-config.php
sudo cp -a /tmp/wordpress/. /var/www/vivalacolifata
sudo chown -R www-data:www-data /var/www/vivalacolifata
curl -s https://api.wordpress.org/secret-key/1.1/salt/

sudo nano /var/www/vivalacolifata/wp-config.php

## CERTBOT

sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d viva.lacolifata.org -d www.viva.lacolifata.org
