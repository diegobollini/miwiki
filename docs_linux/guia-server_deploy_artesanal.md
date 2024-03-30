---
layout: page
title: Setup server (artesanal)
permalink: /setup-server_artesanal/
parent: Linux
---

# Puesta a punto base de servidores

Esto también fue un trabajo manual y con pocas bases, pero de mucho aprendizaje, pruebas e inspiraciones varias. Lo usaba en Arbusta para preparar VMs mucho antes de conocer ansible, terraform, docker, k8s, etc., etc.  
_NdE: Esto lo escribí bastante después de preparar la guía_

## Fuentes

- [TechnoTim](https://www.youtube.com/watch?v=ZsjK4VDopiE)
- [DigitalOcean](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04-es)

## Setup automágico

```bash
# Acá un muchacho compartió su script
# Fuente: https://github.com/jasonheecs/ubuntu-server-setup
$ ssh root@servers_public_IP
```

## Setup artesanal

```bash
$ ssh root@[IP.servidor]
$ apt update && apt upgrade -y
$ reboot

# Actualizaciones de seguridad automáticas
$ apt install unattended-upgrades
$ dpkg-reconfigure --priority=low unattended-upgrades
$ nano /etc/apt/apt.conf.d/20auto-upgrades
    # APT::Periodic::Update-Package-Lists "1";
    # APT::Periodic::Unattended-Upgrade "1";

# Instalar apps importantes
$ apt install mc zip gzip tar ccze fail2ban ufw git

# Agregar user + sudoers
$ adduser diego
$ usermod -aG sudo diego
$ rsync --archive --chown=diego:diego ~/.ssh /home/diego/
$ sudo -l -U diego # para verificar que están OK los permisos sudo

# Configurar ssh, quitar acceso root, cambiar puerto, etc.
$ sudo passwd -l root # deshabilitar inicio de sesión con root
$ apt install openssh-server # por las dudas, debería estar instalado
$ nano /etc/ssh/ssh_config
    Port xxxx
    PermitRootLogin no
    AllowUsers diego
    PasswordAuthentication no
    PermitEmptyPasswords no
$ service ssh restart
```

## Apéndice: SSH Keys

- IMPORTANTE: muy recomendable usar pub / priv keys y no contraseñas  
  Al crear un droplet (DO), un EC2 (AWS), etc. en general ya tenemos cargada nuestra public key, que se asigna a dicho recurso.  
  Suponiendo un proceso desde cero, o para relacionar una key distinta / nueva:

```bash
$ ssh-keygen # en el servidor

# Ahora desde la máquina cliente
$ ssh-keygen # cuidado al guardar, ya que sobreescribe si ya existe con el mismo nombre
...
$ ssh-copy-id user@ip.hostname
# aceptar nuevo server, login, etc.
# revisar permisos de private key (la terminal muestra error en todo caso)
# probar login ssh desde terminal SIN private key
```

## Login SSH

```bash
$ ssh -p xxx -i ~/ruta/key diego@IP
# Para agilizar la conexión, ver abajo
$ ssh tag_server
```

### Configuración local ssh

```bash
# Esto es lo que lee el comando ssh al ejecutarlo
$ sudo nano ~/.ssh/config
    ## tag_server
    Host tag_server
    HostName 45.79.70.222
    Port xxxx
    User diego
    IdentityFile ~/ruta/key
```

## Setup firewall

```bash
$ ufw status
Status: inactive
# dependiendo de la necesidad puntual, usos del server, etc.
$ sudo ufw default allow outgoing
$ sudo ufw default deny incoming
$ sudo ufw allow http
$ sudo ufw allow https
$ sudo ufw allow ssh
$ sudo ufw allow 1234 # en caso de haber cambiado el ssh port
$ sudo ufw enable
```

## zshell, fonts and oh-my-zsh

```bash
# Instalar zsh, themes, omz
$ sudo apt install -y zsh
$ sudo apt install -y powerline fonts-powerline
$ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## Particiones y LVM

En general los servers Ubuntu no vienen con el mejor particionado y no se aprovecha todo el disco...

```bash
# para ver particiones
$ df -h
$ sudo lvm
# para usar todo el disco
lvm> lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv
lvm> exit
$ sudo resize2fs /dev/ubuntu-vg/ubuntu-lv
```

## hostname

Para facilitar la gestión e identificación de los servers, se pueden configurar los hostnames (considerar paradigma servers vs containers).  
Por ejemplo, para el server que aloja el Wordpress con la página de Arbusta:

```bash
$ hostname
arb-com-webback
plataformas@arb-com-webback:~$ hostnamectl
   Static hostname: arb-com-webback
         Icon name: computer-vm
           Chassis: vm
    Virtualization: kvm
  Operating System: Ubuntu 18.04.5 LTS
            Kernel: Linux 4.15.0-126-generic
      Architecture: x86-64
# Para cambiar / editar:
$ sudo hostnamectl set-hostname <nuevo-nombre>
$ sudo nano /etc/hosts
```

## locale y timezone

```bash
$ sudo locale-gen "es_AR.UTF-8"
$ sudo dpkg-reconfigure locales
# timezone
$ timedatectl
$ timedatectl list-timezones
$ sudo timedatectl set-timezone America/Argentina/Buenos_Aires
$ timedatectl # para confirmar
```

## fail2ban

Importante: sólo es 100% útil si se utiliza login por pass. Si se usa key, nunca va a pedir password para loguearse vía ssh. Pero no sobra de todas maneras.

```bash
$ sudo systemctl status fail2ban
$ sudo cp /etc/fail2ban/fail2ban.{conf,local}
$ sudo cp /etc/fail2ban/jail.{conf,local}
$ sudo nano /etc/fail2ban/fail2ban.local
# verificar que loglevel = INFO
# verificar que logtarget = /var/log/fail2ban.log
$ sudo nano /etc/fail2ban/jail.local
# verificar que bantime = 10m
# verificar que findtime = 10m
# verificar que maxretry = 5
# verificar que backend = systemd [para Ubuntu 20.04]
$ sudo systemctl restart fail2ban
$ sudo systemctl status fail2ban
$ sudo fail2ban-client status
# Jail list: sshd
$ sudo fail2ban-client status sshd # para ver más info, si existen bans, etc
```

## PENDIENTES

### Backups

- configure rsync
- [10 Ejemplos Prácticos de rsync](https://www.comoinstalarlinux.com/rsync-local-remoto-archivos-backup-files-commands/)

### Evolución y automatización

- aprender sobre Prometheus
- aprender sobre Ansible
