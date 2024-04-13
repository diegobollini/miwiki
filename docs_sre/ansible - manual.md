---
layout: page
parent: SRE & SysAdmin
title: ansible - manual
# permalink: /docker-full/
---

# Ansible 101

## Recursos

- [Repositorio](https://github.com/ansible/ansible)
- [Documentación](https://docs.ansible.com/)
- [Conceptos básicos de Ansible](https://www.redhat.com/es/topics/automation/learning-ansible-tutorial)
- [Video serie Ansible 101](https://www.youtube.com/playlist?list=PL2_OBreMn7FqZkvMYt6ATmgC0KAGGJNAN)
- [Zabbix + Ansible](https://github.com/ansible-collections/community.zabbix/)
- [Ansible for DevOps examples](https://github.com/geerlingguy/ansible-for-devops)
- [Cómo instalar y utilizar Ansible en Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-ansible-on-ubuntu-20-04-es)

## Introducción

- Inventarios
  - generalmente .yaml
  - Path: `bash/etc/ansible/hosts`
    - personalizar con `i <path>`
- Comandos adhoc
  - no reutilizables, `/usr/bin`
- Playbooks
- Módulos (plugins)
- Varibles, condicionales, bucles
- Roles
- [Galaxy (biblioteca de roles)](https://galaxy.ansible.com/)

## Tasks & Plays

- Plays > conjunto ordenado de tareas que se ejecutan en las selecciones del host desde el archivo de inventario
- Tareas > elementos que llaman a los módulos de Ansible y que conforman un play, y se ejecutan en el mismo orden en que se escribieron.
- Controladores > para ejecutar una tarea específica luego de que se haya realizado un cambio en el sistema (Tasks)
- Variables > modificaciones, diferencias, versiones, rutas, etc.
- Funciones > playbook especial completamente autónomo y portátil que incluye tareas, variables, plantillas de configuración y otros archivos de soporte
- Colecciones > distribución (playbooks + funciones + módulos + plugins)
- Gestión de la configuración > almacenar el estado actual de los sistemas y ayudar a mantenerlo
- Canal de implementación > en general compilación, prueba e implementación

## Instalación

```bash
# Usando pip3
$ apt install python3-pip
$ pip3 --version
pip 20.0.2 from /usr/lib/python3/dist-packages/pip (python 3.8)
# Operaciones básicas
$ pip3 install --upgrade package_name
$ pip3 list
$ pip3 uninstall package_name
$ pip3 install -r requirements.txt

# Instalar ansible (no sudo)
$ pip3 install ansible
Collecting ansible
Successfully installed ansible-4.4.0 ansible-core-2.11.3 packaging-21.0 pyparsing-2.4.7 resolvelib-0.5.4
$ ansible --version
ansible [core 2.11.3]
  config file = /etc/ansible/ansible.cfg
  configured module search path = ['/home/diego/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /home/diego/.local/lib/python3.8/site-packages/ansible
  ansible collection location = /home/diego/.ansible/collections:/usr/share/ansible/collections
  executable location = /home/diego/.local/bin/ansible
  python version = 3.8.10 (default, Jun  2 2021, 10:49:15) [GCC 9.4.0]
  jinja version = 2.10.1
  libyaml = True
```

## Laboratorio

- GCP: ansible-lab

```bash
# Installar gcp sdk (gcloud)
$ echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
$ sudo apt-get install apt-transport-https ca-certificates gnupg
$ curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
$ sudo apt-get update && sudo apt-get install google-cloud-sdk
$ google-cloud-sdk.gcloud --version
$ gcloud --version
Google Cloud SDK 350.0.0
# Lanzar y configurar gcloud
$ gcloud init
Welcome! This command will take you through the configuration of gcloud.
* Commands that require authentication will use xxxxxxx@gmail.com by default
* Commands will reference project `ansible-lab-xxxx` by default
* Compute Engine commands will use region `us-central1` by default
* Compute Engine commands will use zone `us-central1-a` by default
$ gcloud config get-value compute/region
$ gcloud config get-value compute/zone
```

### Laboratorio: VM

```bash
# Luego de crear el proyecto en GCP
$ gcloud compute project-info describe --project ansible-lab-322916
$ gcloud compute instances create ansible-server
NAME            ZONE           MACHINE_TYPE   PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP     STATUS
ansible-server  us-central1-a  n1-standard-1               10.128.0.2   34.122.133.199  RUNNING
# Genera también las key si no existen o no se configuraron
$ gcloud compute ssh ansible-server
# VM
$ uname -a
Linux ansible-server 4.19.0-17-cloud-amd64 1 SMP Debian 4.19.194-3 (2021-07-18) x86_64 GNU/Linux
$ apt update && apt update
$ pip3 install ansible
```

```yml
# inventory
[web]
ansibleclient.usersys.redhat.com
ansibleclient2.usersys.redhat.com
```

Desde mi equipo:

```bash
$ ansible -i inventory testservers -m ping -u diego
$ code ansible.cfg
[defaults]
INVENTORY = inventory
# Todo el grupo testservers, m = modelos (-m command por default)
$ ansible testservers -m ping -u diego
# Comandos adhoc, a = argumentos
$ ansible testservers -a "free -h" -u diego
34.122.133.199 | CHANGED | rc=0 >>
              total        used        free      shared  buff/cache   available
Mem:          3.6Gi       130Mi       1.2Gi       4.0Mi       2.3Gi       3.2Gi
$ ansible testservers -a "date" -u diego
...
```

### Vagrant

Instalar vagrant:

```bash
# Dependencia: virtualbox
$ curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
$ sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
$ sudo apt-get update && sudo apt-get install vagrant
$ vagrant --version
Vagrant 2.2.18
```

Deploy de máquina virtual (ubuntu image):

```bash
$ cd ansible2
$ vagrant init ubuntu/bionic64
A `Vagrantfile` has been placed in this directory. You are now
ready to `vagrant up` your first virtual environment! Please read
the comments in the Vagrantfile as well as documentation on
`vagrantup.com` for more information on using Vagrant.
$ vagrant up
    default: SSH address: 127.0.0.1:2222
    default: SSH username: vagrant
    default: SSH auth method: private key
    default: /vagrant => /home/diego/desarrollo/ansible2
$ vagrant ssh-config
Host default
  HostName 127.0.0.1
  User vagrant
  Port 2222
  UserKnownHostsFile /dev/null
  StrictHostKeyChecking no
  PasswordAuthentication no
  IdentityFile /home/diego/desarrollo/ansible2/.vagrant/machines/default/virtualbox/private_key
  IdentitiesOnly yes
  LogLevel FATAL
$ vagrant [destroy, delete]
$ code Vagrantfile
$ cat playbook.yml

```

Por ejemplo para el caso de un paquete en particular:

```bash
# httpd
$ cat httpd.yml
```

```yml
---
- name: this playbook will install httpd
  hosts: web
  tasks:
    - name: this is the task to install httpd
      yum:
        name: httpd
        state: latest
```
