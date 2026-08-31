# Mi Ansible

Proyecto propio de Ansible para automatizar la preparación de mi notebook personal (Debian 13 / trixie), en reemplazo de las guías artesanales de [Setup notebook (artesanal)](../linux/setup-notebook-artesanal.md) y [Setup notebook (script)](../linux/setup-notebook-script.md).

- [Repositorio](https://github.com/diegobollini/my_ansible)

## Deploy

Instalación rápida (actualiza el sistema, instala Ansible y clona el repo):

```bash
$ sudo apt install -y curl
$ bash -c "$(curl -fsSL https://raw.githubusercontent.com/diegobollini/my_ansible/master/deploy.sh)"
```

Deploy manual:

```bash
$ sudo apt install -y python3-setuptools ansible git stow
$ git clone https://github.com/diegobollini/my_ansible && cd my_ansible
$ ansible-galaxy collection install -r requirements.yml
$ ansible-playbook playbooks/notebook.yml -K --verbose
# Con tags, para correr solo ciertas tareas
$ ansible-playbook playbooks/notebook.yml --tags=github_cli,packages_dev -K --verbose
```

## Estructura

```
roles/diego/
  vars/main.yml     # variables del rol (usuario, git, locale, DNS, extensiones)
  handlers/main.yml # handlers (ej: restart NetworkManager)
  tasks/            # una tarea por área, importadas desde tasks/main.yml
  files/            # dotfiles y assets estáticos
```

Tags disponibles por área: `packages` (con sub-tags `packages_system`, `packages_dev`, etc.), `chrome`, `firefox`, `language`, `telegram`, `discord`, `appearence_wallpaper`, `appearence_gnome`, `ssh`, `code`, `python3`, `docker`, `git` (con `github_cli`, `git_config`), `meld`, `zsh`, `omz`, `ufw`, `dns`, `extensions`, `dock`.

## SSH: qué se versiona y qué no

`roles/diego/files/ssh_config` es la config pública versionada. Los hosts privados (IPs, usuarios, puertos de servidores reales) **no se versionan**: viven en `~/.ssh/config.local`, incluido desde `ssh_config` vía `Include`. El playbook crea ese archivo vacío si no existe; los hosts se agregan a mano en cada máquina después del primer deploy.

## Calidad

CI corre `ansible-lint` (perfil `production`), un chequeo de sintaxis, y un script propio que valida que los paquetes apt usados existan en los repos de Debian trixie:

```bash
$ pip install ansible-core ansible-lint
$ ansible-galaxy collection install -r requirements.yml
$ ansible-lint
$ ansible-playbook playbooks/notebook.yml --syntax-check
```

## Testing con Vagrant

Antes de aplicar cambios en la notebook real, probar en una VM:

```bash
$ vagrant init debian/trixie64
$ vagrant up
$ vagrant ssh
$ vagrant snapshot save default trixie-base
$ vagrant snapshot restore default trixie-base
$ vagrant destroy
```
