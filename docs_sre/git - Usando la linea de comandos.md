---
layout: page
title: GIT - Usando la guía de comandos (videotutorial)
# permalink: /creative_code/
parent: SRE & SysAdmin
---

- Video: [PeladoNerd](https://www.youtube.com/watch?v=kEPF-MWGq1w)
- App: [Learning Git Branching](https://learngitbranching.js.org/)

### Versión, setup inicial

```bash
$ git version
git version 2.39.2
$ git config --global user.name "diegobollini"
$ git config --global user.email "diego.bollini@protonmail.com"
$ git config --list
user.name=diegobollini
user.email=diego.bollini@protonmail.com
```

### Para lanzar el repositorio y definir qué no se va a trackear

```bash
$ sudo git init
Inicializado repositorio Git vacío en /home/diego_manjaro/mirepositorio/.git/
$ touch privado.txt #por ejemplo, para cargar credenciales
$ nano .gitignore #agrego privado.txt para que git lo ignore, pueden ser carpetas, extensiones, etc.
```

### Status

```bash
$ git status
	En la rama master
	No hay commits todavía
	Archivos sin seguimiento:
  	(usa "git add <archivo>..." para incluirlo a lo que se será confirmado)
		.gitignore
	no hay nada agregado al commit pero hay archivos sin seguimiento presentes (usa "git add" para hacerles 	seguimiento)
```

### Para agregar o quitar del trackeo

```bash
$ git add -A
$ git status
	Cambios a ser confirmados:
	  (usa "git rm --cached <archivo>..." para sacar del área de stage)
		nuevo archivo:  .gitignore
		nuevo archivo:  Tutorial: Usando la linea de comandos en Git
$ git rm --cached [archivo o carpeta] #para que git no trackee
```

```bash
$ sudo git commit -m "Empezando mi primer repositorio posta desde la línea de comandos"
[master (commit-raíz) 4554c53] Empezando mi primer repositorio posta desde la línea de comandos
 9 files changed, 191 insertions(+)
 $ git log
 commit 4554c534f6aef4d722ebbd4021ee91ab08df0679 (HEAD -> master)
 Author: Diego Bollini <diego.bollini@protonmail.com>
 Date:   Sun Feb 9 20:04:21 2020 -0300

     Empezando mi primer repositorio posta desde la línea de comandos
```

### Para trabajar con repositorios ya existentes

```bash
$ git clone https://.....
$ nano index.html #suponiendo que ese archivo exista, lo edito
$ git status #va a mostrar que hay un archivo local que tuvo modificaciones
$ git diff #va a mostrar las diferencias entre el archivo del repositorio y mi versión local
$ git add index.html
$ git commit -m "Agregando unas líneas"
```

### Actualizar repositorio local y web

```bash
$ git pull origin master #para descargar la última versión, SIEMPRE que se arranque con un proyecto
$ git push origin master #para subir / actualizar
```

### Branch (para no "pisarse" al trabajar entre varias personas a la vez)

```bash
$ git branch nuevafeature #crea la rama nuevafeature
$ git checkout nuevafeature #para cambiar a la nueva rama
Cambiado a rama 'nuevafeature'
$ git branch -a #para ver la lista de ramas
$ git branch -d nuevafeature
Eliminada la rama nuevafeature (era ec4ecca)..
```

### Merge (crea un commit especial que tiene dos padres diferentes)

```bash
$ git push -u origin nuevafeature #para actualizar el repositorio master con los cambios que hice en mi rama
$ git branch --merged
* master
$ git merge nuevafeature
$ git push origin --delete nuevafeature
```

### Rebase (copia un conjunto de commits y los aplica sobre otros)

```bash
$ git rebase master #desde otra rama, copiamos los commits a la "línea" de master
$ git rebase nuevafeature #desde master, al ser rama ancestra las iguala de nivel
```

### HEAD (el commit sobre el que estoy trabajando)

```bash
#HEAD siempre apunta al commit más reciente
#detachear = adjuntar a commit y no a branch (HEAD -> master -> C1)
$ git checkout [hash del commit] (HEAD -> C1)
```

### Referencias relativas

```bash
$ git log #para visualizar commits, se pueden identificar con una cantidad mínima (por ejemplo fed2 si el hash es fed2da64c0efc529...)
#Moverse un commit atrás con ^
#Moverse una cantidad de commits atrás con ~<num>
$ git checkout master^ #se posiciona en el commit padre del que estoy posicionado
$ git checkout master^^ #dos niveles "hacia arriba"
```
