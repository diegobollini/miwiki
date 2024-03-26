---
layout: page
title: Setup notebook (artesanal)
permalink: /setup-notebook_artesanal/
parent: Linux
---

# El setup de mi notebook

## Notebook 2021 - (...)

- Lenovo Thinkpad L15 Gen2
- 11th Gen Intel® Core™ i5-1135G7 @ 2.40GHz de cuádruple núcleo
- Intel® Xe Graphics (TGL GT2)
- 15,3 GiB de memoria

## OS [202201]

- elementary OS 6.1 Jólnir
  - [Website](https://elementary.io/)
  - [r/elementaryos](https://www.reddit.com/r/elementaryos/)
- Basado en Ubuntu 20.04.3 LTS

## Configuración

Lo que sigue a partir de acá es un gran trabajo artesanal para preparar mi notebook con las aplicaciones, configuraciones y demás cosillas que suelo usar. Con el tiempo aprendí a incorporar scripts y recientemente Ansible, pero parece interesante poder ver mi _,entiendo,_ evolución...

## Tweaks & personalization

### Pantheon tweaks

```bash
# Agregar key, repositorio, instalar paquete
$ apt install software-properties-common -y
$ apt-key adv --keyserver keyserver.ubuntu.com --recv c42d52715a84c7d0d02fc740c1d89326b1c71ab9
$ echo -e "deb http://ppa.launchpad.net/philip.scott/pantheon-tweaks/ubuntu focal main\ndeb-src http://ppa.launchpad.net/philip.scott/pantheon-tweaks/ubuntu focal main" | tee /etc/apt/sources.list.d/pantheon-tweaks.list
$ apt update
$ apt install pantheon-tweaks -y
```

### [Papirus Icons](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme)

```bash
# Para instalar unos íconos que me gustan
$ sudo add-apt-repository ppa:papirus/papirus
$ sudo apt-get update
$ sudo apt-get install papirus-icon-theme -y
```

## Screen capture

### [Flameshot](https://flameshot.org/)

```bash
# Buenísimo para capturas de pantalla y edición
$ apt install flameshot -y
```

### [Peek](https://github.com/phw/peek)

```bash
# Para grabar gifs muy fácil
$ apt install software-properties-common -y
$ add-apt-repository ppa:peek-developers/stable -y
$ apt update
$ apt install peek -y
```

### [OBS Studio](https://obsproject.com/)

```bash
# Ya no lo uso pero sirve también para grabar la pantalla, meets, etc.
$ apt install ffmpeg software-properties-common -y
$ add-apt-repository ppa:obsproject/obs-studio -y
$ apt-get install obs-studio -y
```

## Browsers

### Firefox

```bash
# Por si no está incluído
$ apt install firefox -y
```

## Programming

### [git](https://git-scm.com/)

```bash
# Debería estar instalado pero bue
$ apt-get install git -y
# Setup básico
$ chmod 600 ~/.ssh/id_rsa
$ git config --global user.name "diegobollini"
$ git config --global user.email "diego.bollini@protonmail.com"
$ git config --global color.ui true
$ git config --global --list
```

### [zsh](https://medium.com/@ilovepixelart/elementary-os-5-0-juno-oh-my-zsh-16a0cf0284b1)

```bash
# Instalar zsh, omz, tema, fuente, etc.
$ apt-get install zsh -y
$ usermod -s /usr/bin/zsh $(whoami)
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
# Needs reboot
$ apt-get install powerline fonts-powerline -y
$ apt-get install zsh-theme-powerlevel9k zsh-syntax-highlighting -y
$ echo "source /usr/share/powerlevel9k/powerlevel9k.zsh-theme" >> ~/.zshrc
$ echo "source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc
nano ~/.zshrc
# change ZSH_THEME="agnoster" and fonts in Tweaks
$ git clone https://github.com/powerline/fonts.git
$ cd fonts
$ ./install.sh
# clean-up a bit
$ cd ..
$ rm -rf fonts
```

### [Visual Studio Code](https://code.visualstudio.com/)

- Tengo configurada la sincronización de extensiones y configuraciones con la cuenta de github, muy práctico

```bash
# Agregar key, repo, instalar
$ wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
$ install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
$ sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
$ apt install apt-transport-https -y
$ apt update
$ apt install code -y
```

### docker y docker compose

- [Install Docker Engine](https://docs.docker.com/engine/install/ubuntu/)

```bash
$ apt-get remove docker docker-engine docker.io containerd runc -y
$ apt-get install apt-transport-https ca-certificates curl gnupg lsb-release -y
# verificar distro
$ echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu bionic stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
$ apt-get install docker-ce docker-ce-cli containerd.io -y
```

### Vagrant

```bash
# Key, repo, instalar
$ curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
$ sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
$ sudo apt-get update && sudo apt-get install vagrant
```

## Sound & Video

### spotify

```bash
# Para poner sobre todo listas para escuchar de fondo
$ curl -sS https://download.spotify.com/debian/pubkey_0D811D58.gpg | apt-key add -
$ echo "deb http://repository.spotify.com stable non-free" | tee /etc/apt/sources.list.d/spotify.list
$ apt-get update && apt-get install spotify-client -y
```

## System

### Battery performance

```bash
# [battery drain](https://www.reddit.com/r/elementaryos/comments/cyg6gq/battery_drain_during_sleep/)
$ apt install tlp powertop -y
```

### 7Zip

```bash
# Compresión
$ sudo apt install p7zip-full p7zip-rar -y
```

## Remote access and communication

PD: ¿por qué pongo los títulos en inglés?

### Slack

```bash
# Ya no lo uso fuera del trabajo pero queda
# Verificar última versión
$ wget https://downloads.slack-edge.com/linux_releases/slack-desktop-4.14.0-amd64.deb
$ apt install ./slack-desktop-4.14.0-amd64.deb -y
```

### Anydesk

```bash
# Acceso remoto
$ wget -qO - https://keys.anydesk.com/repos/DEB-GPG-KEY | apt-key add -
$ echo "deb http://deb.anydesk.com/ all main" > /etc/apt/sources.list.d/anydesk-stable.list
$ apt update
$ apt install anydesk -y
```

### Telegram

```bash
# Chat y stickers
$ add-apt-repository ppa:atareao/telegram
$ apt update && apt install telegram -y
```

### Discord

```bash
# Verificar última versión
$ wget -O discord.deb "https://discordapp.com/api/download?platform=linux&format=deb"
$ apt install ./discord-0.0.13.deb
```
