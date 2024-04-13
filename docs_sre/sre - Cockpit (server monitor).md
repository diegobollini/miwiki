---
layout: page
title: Implementando Cockpit (web-based graphical interface for servers)
# permalink: /creative_code/
parent: SRE & SysAdmin
---

# Implementando Cockpit

[Sitio oficial](https://cockpit-project.org/)  
[Red Hat](https://www.redhat.com/sysadmin/intro-cockpit)  
[Guía 01](https://linuxhostsupport.com/blog/install-cockpit-on-ubuntu-18-04/)

## Recursos varios

- [How to Manage Linux Servers with the Cockpit Web Interface](https://www.howtogeek.com/702841/how-to-manage-linux-servers-with-the-cockpit-web-interface/)
- [Make Container Management Easy With Cockpit](https://www.linux.com/topic/desktop/make-container-management-easy-cockpit/)
- [Linux Server Web GUI - management with cockpit](https://www.youtube.com/watch?v=1HEO7qXa6jo)
- [Ubuntu Linux 101: Installing Cockpit on Ubuntu 18.04](https://www.youtube.com/watch?v=SoyqON3yRYo)

## SSH Keys

```bash
# https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-1804
$ ssh-keygen
Your identification has been saved in /home/diego/_desarrollo/cockpit_key.
Your public key has been saved in /home/diego/_desarrollo/cockpit_key.pub.
```

### Configuración server

```bash
# Cheatsheet - Alta de servidores
# Script new_server.sh
$ ssh -i /.ssh/id_rsa root@165.xxx.xx.x
$ bash new_server.sh
# Al volver a loguear se carga la pass para el user
```

## Cockpit

### Instalar cockpit y plugins

```bash
$ sudo apt install cockpit
$ sudo apt install cockpit-dashboard cockpit-machines cockpit-networkmanager cockpit-packagekit cockpit-storaged cockpit-bridge # cockpit-pcp
$ sudo apt update --fix-missing
$ sudo dpkg --configure -a
$ sudo systemctl restart cockpit.socket
$ sudo systemctl enable --now cockpit.socket
```

<!-- ### Configurar nginx

- [Guía](https://github.com/cockpit-project/cockpit/wiki/Proxying-Cockpit-over-NGINX#virtual-host-file)

```bash
$ sudo apt install nginx
$ sudo nano /etc/cockpit/cockpit.conf
    [WebService]
    Origins = http://localhost:9090 https://servidores.arbusta.net
    ProtocolHeader = X-Forwarded-Proto
$ sudo systemctl restart cockpit.socket
$ sudo nano /etc/nginx/sites-available/servidores.arbusta.net
$ sudo ln -s /etc/nginx/sites-available/servidores.arbusta.net /etc/nginx/sites-enabled/
$ sudo nginx -t
$ sudo systemctl restart nginx.service
``` -->

## Apache webserver

```bash
$ dpkg -l | grep -i apache2
$ ps aux | grep apache2
$ apt-get install apache2
$ systemctl enable apache2
$ systemctl status apache2
```

### Install a Let’s Encrypt SSL certificate

```bash
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get install certbot python-certbot-apache
$ sudo certbot --apache -d dominio.com
```

## Set a Reverse Proxy in Apache

```bash
# https://linuxhostsupport.com/blog/install-cockpit-on-ubuntu-18-04/
$ a2enmod proxy
$ a2enmod proxy_http
$ a2enmod proxy_wstunnel
$ systemctl restart apache2
$ cp /etc/apache2/sites-available/000-default-le-ssl.conf /etc/apache2/sites-available/dominio.com.conf
$ nano /etc/apache2/sites-available/dominio.com.conf
$ a2dissite 000-default
$ a2dissite 000-default-le-ssl.conf
$ a2ensite dominio.com
$ systemctl restart apache2
$ sudo nano /etc/cockpit/cockpit.conf
#    [WebService]
#    Origins = https://dominio.com http://127.0.0.1:9090
#    ProtocolHeader = X-Forwarded-Proto
#    AllowUnencrypted = true
$ systemctl restart cockpit.socket
$ systemctl enable cockpit.socket
```

### Finalmente

[Monitor web Cockpit](https://dominio.com/)

## Agregar servidores remotos

- [Link](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_systems_using_the_rhel_8_web_console/)

```bash
$ ssh-keygen
Password to the generated SSH key.
The contents of the ~/.ssh/id_rsa.pub file copied in the clipboard.
Your identification has been saved in /home/diego/.ssh/cockpitweb_key.
Your public key has been saved in /home/diego/.ssh/cockpitweb_key.pub.
# agregué mi llaves (pub y priv) para poder conectarme al resto de los servidores
$ cat ~/.ssh/id_rsa.pub | ssh USER@HOST "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```
