---
layout: page
title: Setup notebook (script)
permalink: /setup-notebook_script/
parent: Linux
---

# Introducción

Copio el script porque me pareció la manera más fácil de subirlo. Para ejecutarlo, copiar todo el contenido y por ejemplo:

```bash
$ nano script_setup.sh
# Pegar el script y guardar
# Permisos de ejecución
$ chmod +x script_setup.sh
# Ejecutar
$ sudo bash script_setup.sh
```

## Sript

```bash
#!/bin/bash
# POSIBLEMENTE ESTO NO FUNCIONE COMO CORRESPONDE (2022)

###################################################################################################
# Author(s): Bolli
# The purpose of this script is to install and configure the programs, tools and dependencies that
# I use on a daily basis both for work and experimentation.
# Of course, it is a work in progress and constantly evolving.
# Inspired by Andrés great work
# Distro: Ubuntu 20.04 LTS (from 20210628)
# Before: elementaryOS.
#
# Dependencies: git (using git clone), curl
#
#
# TO DO:
# - Change icons & other tweaks
# - nano ~/.zshrc & change ZSH_THEME="agnoster" and fonts in Tweaks
# - filezilla, gparted, virtualbox, transmission, libreoffice
###################################################################################################

function AptInstall() {
    $INSTALL $@
    if [ $? -ne 0 ]; then
        echo "Fail installing" $@
        exit -1
    fi
}

function Setup() {
    echo "### AUTOMAGIC SCRIPT TO PREPARE MY WORK ENVIRONMENT ###"

    # Global parameters
    INSTALL="sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -q=2"
    UPDATE="sudo apt-get update -q=2"
    UPGRADE="sudo apt-get upgrade -y -q=2"
    ADDAPTREPOSITORY="sudo add-apt-repository -y"
    CLEARREPO="sudo rm -rf /var/lib/apt/lists/* && sudo apt-get clean"

    set -v  # This show every steps made.
    set -e  # This script will be stop if a error occurs.

    # Make install_logs.log file.
    exec > >(tee -a install_logs.log)
    exec 2> >(tee -a install_logs.log >&2)

# Basic installation

    # Update and upgrade all packages
    echo "### FULL UPDATE Y UPGRADE ###"
    $UPDATE
    $UPGRADE

    # Finish installing en language.
    echo "### INSTALL EN LANGUAGE ###"
    AptInstall language-pack-en language-pack-gnome-en language-pack-en-base language-pack-gnome-en-base
    AptInstall `check-language-support -l en`

    # Install es language.
    echo "### INSTALL ES LANGUAGE ###"
    AptInstall language-pack-es language-pack-gnome-es language-pack-es-base language-pack-gnome-es-base
    AptInstall `check-language-support -l es`

    # Uncomment en_US.UTF-8 UTF-8 and es_AR.UTF-8 UTF-8 from locales list.
    echo "### UNCOMMENTING en_US.UTF-8 UTF-8 && es_AR.UTF-8 UTF-8 ###"
    sudo sed -i 's|#en_US.UTF-8 UTF-8|en_US.UTF-8 UTF-8|g' /etc/locale.gen
    sudo sed -i 's|#es_AR.UTF-8 UTF-8|es_AR.UTF-8 UTF-8|g' /etc/locale.gen

    # Generate locales.
    echo "### GENERATING LOCALES ###"
    sudo locale-gen

    # Install Ubuntu restricted extras.
    echo "### INSTALL RESTRICTED EXTRAS ###"
    AptInstall ubuntu-restricted-extras

    # Imrpove battery performance
    echo "### INSTALL TLP & POWERTOP ###"
    AptInstall tlp powertop

    # 7Zip
    echo "### INSTALL 7ZIP ###"
    AptInstall p7zip-full p7zip-rar

# Initial customizations

    # Pantheon tweaks
    echo "### INSTALL ELEMENTARY TWEAKS ###"
    AptInstall software-properties-common
    $ADDAPTREPOSITORY ppa:philip.scott/elementary-tweaks
    AptInstall elementary-tweaks

    # Change Hotkey launcher (elementary)
    echo "### CHANGE HOTKEY / SHORTCUT LAUNCHER ###"
    gsettings set org.gnome.mutter overlay-key "'Super_L'"
    gsettings set org.pantheon.desktop.gala.behavior overlay-action "'wingpanel --toggle-indicator=app-launcher'"

    # [Papirus Icons](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme)
    echo "### INSTALL PAPIRUS ICONS ###"
    $ADDAPTREPOSITORY ppa:papirus/papirus
    $UPDATE
    AptInstall papirus-icon-theme

# Basic apps

    # Synapse Launcher
    echo "### INSTALL SYNAPSE LAUNCHER ###"
    AptInstall synapse

    # Install Flameshot.
    echo "### INSTALL FLAMESHOT ###"
    AptInstall flameshot

    # [Peek](https://github.com/phw/peek)
    echo "### INSTALL PEEK ###"
    AptInstall software-properties-common
    $ADDAPTREPOSITORY ppa:peek-developers/stable
    AptInstall peek

    # [OBS Studio](https://obsproject.com/)
    echo "### INSTALL OBS ###"
    AptInstall ffmpeg software-properties-common
    $ADDAPTREPOSITORY ppa:obsproject/obs-studio
    AptInstall obs-studio

# Browsers

    # Brave
    echo "### INSTALL BRAVE BROWSER ###"
    AptInstall apt-transport-https  curl gnupg
    sudo curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/brave-browser-archive-keyring.gpg arch=amd64] https://brave-browser-apt-release.s3.brave.com/ stable main"|sudo tee /etc/apt/sources.list.d/brave-browser-release.list
    $UPDATE
    AptInstall brave-browser

    ### Firefox
    echo "### INSTALL FIREFOX ###"
    AptInstall firefox

# Programming tools

    # [git](https://git-scm.com/)
    echo "### INSTALL & CONFIG GIT ###"
    AptInstall git
    git config --global user.name "diegobollini"
    git config --global user.email "diego.bollini@protonmail.com"
    git config --global color.ui true
    git config --global --list

    # [zsh](https://medium.com/@ilovepixelart/elementary-os-5-0-juno-oh-my-zsh-16a0cf0284b1)
    echo "### INSTALL ZSH TERMINAL ###"
    AptInstall zsh
    sudo usermod -s /usr/bin/zsh $(whoami)
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
    AptInstall powerline fonts-powerline zsh-theme-powerlevel9k zsh-syntax-highlighting
    echo "source /usr/share/powerlevel9k/powerlevel9k.zsh-theme" >> ~/.zshrc
    echo "source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc
    git clone https://github.com/powerline/fonts.git
    cd fonts
    ./install.sh
    cd ..
    rm -rf fonts

    # Install Visual Studio Code.
    echo "### INSTALL VISUAL STUDIO CODE"
    wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
    sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
    sudo sh -c 'echo "deb [arch=amd64,arm64,armhf signed-by=/etc/apt/trusted.gpg.d/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
    AptInstall apt-transport-https -y
    $UPDATE
    AptInstall code -y

    # docker y docker compose
    echo "### INSTALL DOCKER Y DOCKER-COMPOSE ###"
    sudo apt-get remove docker docker-engine docker.io containerd runc -y
    AptInstall apt-transport-https ca-certificates curl gnupg lsb-release
    sudo echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu bionic stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    AptInstall docker-ce docker-ce-cli containerd.io

# Sound & Video

    # Spotify
    echo "### INSTALL SPOTIFY ###"
    curl -sS https://download.spotify.com/debian/pubkey_0D811D58.gpg | sudo apt-key add -
    echo "deb http://repository.spotify.com stable non-free" | sudo tee /etc/apt/sources.list.d/spotify.list
    $UPDATE
    AptInstall spotify-client

# Remote access and communication

    # Slack
    echo "### INSTALL SLACK ###"
    wget https://downloads.slack-edge.com/linux_releases/slack-desktop-4.14.0-amd64.deb
    AptInstall ./slack-desktop-4.14.0-amd64.deb

    # Teamviewer
    echo "### INSTALL TEAMVIEWER ###"
    wget https://download.teamviewer.com/download/linux/teamviewer_amd64.deb
    AptInstall ./teamviewer_amd64.deb

    # Anydesk
    echo "### INSTALL ANYDESK ###"
    wget -qO - https://keys.anydesk.com/repos/DEB-GPG-KEY | apt-key add -
    echo "deb http://deb.anydesk.com/ all main" > /etc/apt/sources.list.d/anydesk-stable.list
    $UPDATE
    AptInstall anydesk

    # Telegram
    echo "### INSTALL TELEGRAM ###"
    $ADDAPTREPOSITORY ppa:atareao/telegram
    AptInstall telegram

    # Discord
    echo "### INSTALL DISCORD ###"
    wget -O discord.deb "https://discordapp.com/api/download?platform=linux&format=deb"
    AptInstall ./discord-0.0.13.deb

    #Clean
    sudo apt autoremove -y -q=2

    # Listo
    echo "\nAll done!\n"
    sleep 2
    exit 0
}

Setup
```
