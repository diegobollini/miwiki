---
layout: page
parent: SRE & SysAdmin
title: GIT - SSOT
permalink: /git-ssot/
---

# Git Single Source of Truth

La idea es sistematizar toda la información, aprendizajes, pruebas acerca de git (y relacionado) en este único archivo. Quizás se actualice, quizás no.

- [Video](https://www.youtube.com/watch?v=kEPF-MWGq1w)
- [Learning Git Branching](https://learngitbranching.js.org/)

## Versión, setup inicial

```bash
$ git version
git version 2.25.0
$ git config --global user.name "diegobollini"
$ git config --global user.email "diego.bollini@protonmail.com"
$ git config --list
user.name=diegobollini
user.email=diego.bollini@protonmail.com
```

## Para lanzar el repositorio y definir qué no se va a trackear

```bash
$ sudo git init
Inicializado repositorio Git vacío en /home/diego_manjaro/mirepositorio/.git/
$ touch privado.txt #por ejemplo, para cargar credenciales
$ nano .gitignore #agrego privado.txt para que git lo ignore, pueden ser carpetas, extensiones, etc.
```

## Status

```bash
$ git status
En la rama master
No hay commits todavía
Archivos sin seguimiento:
    (usa "git add <archivo>..." para incluirlo a lo que se será confirmado)
    .gitignore
    no hay nada agregado al commit pero hay archivos sin seguimiento presentes (usa "git add" para hacerles seguimiento)
```

## Para agregar o quitar del trackeo

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

## Para trabajar con repositorios ya existentes

```bash
$ git clone https://.....
$ nano index.html #suponiendo que ese archivo exista, lo edito
# ver archivo local que tuvo modificaciones
$ git status
$ git diff #va a mostrar las diferencias entre el archivo del repositorio y mi versión local
$ git add index.html
$ git commit -m "Agregando unas líneas"
```

## Actualizar repositorio local y web

```bash
# para descargar la última versión, SIEMPRE que se arranque con un proyecto
$ git pull origin master
$ git push origin master #para subir / actualizar
```

## Branch (para no "pisarse" al trabajar entre varias personas a la vez)

```bash
$ git branch nuevafeature #crea la rama nuevafeature
$ git checkout nuevafeature #para cambiar a la nueva rama
Cambiado a rama 'nuevafeature'
$ git branch -a #para ver la lista de ramas
$ git branch -d nuevafeature
Eliminada la rama nuevafeature (era ec4ecca)..
```

## Merge (crea un commit especial que tiene dos padres diferentes)

```bash
$ git push -u origin nuevafeature #para actualizar el repositorio master con los cambios que hice en mi rama
$ git branch --merged
* master
$ git merge nuevafeature
$ git push origin --delete nuevafeature
```

## Rebase (copia un conjunto de commits y los aplica sobre otros)

```bash
# desde otra rama, copiamos los commits a la "línea" de master
$ git rebase master
$ git rebase nuevafeature #desde master, al ser rama ancestra las iguala de nivel
```

## HEAD (el commit sobre el que estoy trabajando)

```bash
#HEAD siempre apunta al commit más reciente
#detachear = adjuntar a commit y no a branch (HEAD -> master -> C1)
$ git checkout [hash del commit] (HEAD -> C1)
```

## Referencias relativas

```bash
$ git log #para visualizar commits, se pueden identificar con una cantidad mínima (por ejemplo fed2 si el hash es fed2da64c0efc529...)
#Moverse un commit atrás con ^
#Moverse una cantidad de commits atrás con ~<num>
$ git checkout master^ #se posiciona en el commit padre del que estoy posicionado
$ git checkout master^^ #dos niveles "hacia arriba"
```

# Prácticas con git y repositorios

## Comprobando versión

```bash
➜  ~ git version
git version 2.30.0
```

## Comprobando variables y configuraciones de entorno

```bash
➜  ~ git config --list
user.name=Diego Bollini
user.email=diego.bollini@protonmail.com
➜  ~ git config user.name
Diego Bollini
➜  ~ git config user.email
diego.bollini@protonmail.com
```

## Creando carpeta e iniciando repositorio

```bash
➜  ~ pwd
/home/diego
➜  ~ cd _desarrollo
➜  _desarrollo pwd
/home/diego/_desarrollo
➜  _desarrollo mkdir repositorio_test
➜  _desarrollo cd repositorio_test
➜  repositorio_test git init
Initialized empty Git repository in /home/diego/_desarrollo/repositorio_test/.git/
➜  ~
```

## Creo archivo index.html + status

```bash
➜  ~ git status
On branch main
No commits yet
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	index.html
nothing added to commit but untracked files present (use "git add" to track)
```

## De working directory a staging area

```bash
➜  ~ git add index.html # con git add . se agregan todos los archivos del directorio
➜  ~ git status
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   index.html
```

## De staging area al repositorio

```bash
➜  ~ git commit -m "Primer commit"
[main (root-commit) 388b3ca] Primer commit
 1 file changed, 12 insertions(+)
 create mode 100644 index.html
➜  ~ git log
commit 388b3caa77e0160cdf64e2980f89cf78f1092a80 (HEAD -> main)
Author: Diego Bollini <diego.bollini@protonmail.com>
Date:   Tue Feb 16 13:24:03 2021 -0300

    Primer commit
```

## Ramas

### Crear y moverse entre ramas

```bash
➜  ~ git branch nueva-rama
➜  ~ git branch
* main
nueva-rama
➜  ~ git checkout nueva-rama
Switched to branch 'nueva-rama'
➜  ~ git branch -l
main
* nueva-rama
```

### Eliminar ramas

```bash
➜  ~ git checkout main
Switched to branch 'main'
➜  ~ git branch -l
* main
nueva-rama
➜  ~ git branch -D nueva-rama
Deleted branch nueva-rama (was 388b3ca).
➜  ~ git branch
* main
```

## Práctica

```bash
➜  ~ git branch test_rama
➜  ~ git checkout test_rama
Switched to branch 'test_rama'
➜  ~ git branch -l
➜  ~ git status
On branch test_rama
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   index.html
no changes added to commit (use "git add" and/or "git commit -a")
➜  ~ git add .
➜  ~ git commit -m "Agregando h1 al html"
[test_rama 2e10251] Agregando h1 al html
 1 file changed, 1 insertion(+), 1 deletion(-)
➜  ~ git status
On branch test_rama
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   index.html

no changes added to commit (use "git add" and/or "git commit -a")
➜  ~ git add .
➜  ~ git commit -m "Agregando h2 al html"
[test_rama ab2a2ea] Agregando h2 al html
 1 file changed, 1 insertion(+)
➜  ~ git add .
➜  ~ git commit -m "Agregando párrafo genérico"
[test_rama 79678c1] Agregando párrafo genérico
 1 file changed, 1 insertion(+)
➜  ~ git log --oneline
79678c1 (HEAD -> test_rama) Agregando párrafo genérico
ab2a2ea Agregando h2 al html
2e10251 Agregando h1 al html
388b3ca (main) Primer commit
➜  ~ git checkout ab2a2ea # Para moverme a un commit específico (ver que el párrafo del 3° commit no está visible en index.html)
Note: switching to 'ab2a2ea'.
...
HEAD is now at ab2a2ea Agregando h2 al html
➜  ~ git branch
* (HEAD detached at ab2a2ea)
main
test_rama
```

### Mergeando ramas

```bash
➜  ~ git checkout main
Previous HEAD position was ab2a2ea Agregando h2 al html
Switched to branch 'main'
➜  ~ git merge test_rama
Updating 388b3ca..79678c1
Fast-forward
 index.html | 4 +++-
 1 file changed, 3 insertions(+), 1 deletion(-)
```

- el html debería estar completo e incluir los últimos cambios

## Repositorio cloud en GitLab

### Creo el repositorio y lo clono

```bash
➜  ~ pwd
/home/diego/_desarrollo
➜  ~ git clone git@gitlab.com:diegobollini/aprendiendo-git.git
➜  ~ cd aprendiendo_git/
➜  ~ touch index.html
➜  ~ git status
➜  ~ git add .
➜  ~ git commit -m "Primer commit local"
➜  ~ git status
➜  ~ git push #Para subir los cambios al repositorio cloud
```

### Ramas

```bash
➜  ~ git branch nueva_rama
➜  ~ git branch
➜  ~ git checkout nueva_rama
➜  ~ git branch -l
```

- hice algunos cambios en el html

- puede servir ayudarse con VSC que también permite gestionar git

```bash
➜  ~ git log --oneline
➜  ~ git checkout 124ce13 # Uno de los commits con cambios
➜  ~ git branch
```

### Práctica - Listar commits

```bash
➜  ~ git branch rama_prueba
➜  ~ git checkout rama_prueba
➜  ~ git branch # OK
# Hago cambios en el html
➜  ~ git add .
➜  ~ git commit -m "add h4 in html"
```

### Mergear ramas

```bash
➜  ~ git checkout master
➜  ~ git branch # OK
➜  ~ git merge rama_prueba

```

### Eliminar rama

```bash
➜  ~ git checkout main
➜  ~ git branch -l
➜  ~ git branch -D nueva-rama
➜  ~ git branch
```
