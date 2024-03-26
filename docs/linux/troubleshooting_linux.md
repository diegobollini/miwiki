---
layout: page
title: Troubleshooting
permalink: /troubleshooting_linux/
parent: Linux
---

Serie de links, recursos y fix rápidos para algunas cuestiones recurrentes en Linux (al menos en mi experiencia).

## Recursos

- [Súper Chuleta](https://docs.google.com/document/d/1tUwaR-53FSaaDI70cHm8VW1Dy8gRJcgORbSjhcTxXZ8)
- [The Linux Command Handbook](https://www.freecodecamp.org/news/the-linux-commands-handbook)
- [How to Set Up SSH Keys on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)
- [30 Linux System Monitoring Tools](https://www.cyberciti.biz/tips/top-linux-monitoring-tools.html)
- [Learn the ways of Linux-fu](https://linuxjourney.com)
- [40 Linux Server Hardening Security Tips](https://www.cyberciti.biz/tips/linux-security.html)
- [Top 20 OpenSSH Server Best Security Practices](https://www.cyberciti.biz/tips/linux-unix-bsd-openssh-server-best-practices.html)
- [Digital Ocean - Tutorials](https://www.digitalocean.com/community/tutorials?language=en)

## Herramientas

- [Duplicati - Free backup software](https://www.duplicati.com)


### Virtualbox: install guest additions on Ubuntu 20.04 LTS Focal Fossa

- [Link](https://linuxconfig.org/virtualbox-install-guest-additions-on-ubuntu-20-04-lts-focal-fossa)

```bash
$ sudo add-apt-repository multiverse
$ sudo apt install virtualbox-guest-dkms virtualbox-guest-x11
All done. Reboot your virtual machine:
$ sudo reboot
Confirm the Virtualbox guest additions:
lsmod  | grep vbox
vboxsf                 81920  0
vboxguest             344064  6 vboxsf
```

### zsh + omz + plugins

- [omz y plugins](https://gist.github.com/dogrocker/1efb8fd9427779c827058f873b94df95)
- [Lista de plugins](https://github.com/dogrocker/awesome-zsh-plugins)

```bash
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
# Download zsh-autosuggestions by
$ git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
# Download zsh-syntax-highlighting by
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
$ nano ~/.zshrc find plugins=(git)
# Append zsh-autosuggestions & zsh-syntax-highlighting to plugins() like this
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

### How to Access USB from VirtualBox Guest OS

- [Link](https://www.linuxbabe.com/virtualbox/access-usb-from-virtualbox-guest-os)

```bash
# Install Virtualbox Extension Pack > https://download.virtualbox.org/virtualbox/
$ sudo gpasswd -a $USER vboxusers
$ groups $USER
# Virtualbox > Enable USB Controller and Add New USB filter > Settings > USB
```

### bpytop – Awesome resource monitor

- [Link](https://www.cyberciti.biz/open-source/command-line-hacks/bpytop-awesome-linux-macos-and-freebsd-resource-monitor)

```bash
# con python y pip instalados
$ pip3 install bpytop --upgrade
$ bpytop
```

### Vagrant

- [Web](https://www.vagrantup.com)
- [Vagrant boxes](https://app.vagrantup.com/boxes/search)

```bash
# Instalar vagrant
$ curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
$ sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
$ sudo apt-get update && sudo apt-get install vagrant
```

```bash
# Running VM in VirtualBox running Ubuntu 18.04 LTS 64-bit
$ vagrant init hashicorp/bionic64
$ vagrant up
$ vagrant ssh
$ vagrant destroy
```
