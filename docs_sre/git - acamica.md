---
layout: page
title: GIT - Curso básico Acamica
# permalink: /creative_code/
parent: SRE & SysAdmin
---

# GIT

[Sitio oficial](https://git-scm.com/)

## ¿Qué es GIT?

_Software de control de versiones diseñado por Linus Torvalds, pensando en la eficiencia y la confiabilidad del mantenimiento de versiones de aplicaciones cuando estas tienen un gran número de archivos de código fuente_

```bash
$ git --version
git version 2.26.0
```

## Glosario básico

- Repositorio: carpeta, archivos del proyecto
- Revisión: versión
- Commit: conjunto de cambios, acción por la que se persisten los cambios realizados
- Local
- Stagging: área de carga para commitear o ignorar

## Comandos básicos

[Documentación](https://git-scm.com/docs/)

```bash
$ git init #inicializa un proyecto
$ git status #status de la copia local, tracked / untracked
$ git add archivo
$ git add . #todos los archivos de esa ubicación
$ git commit -m "comentario" #-m = título del mensaje
$ git log
```

## Diferencias y cambios

```bash
$ git diff #cambios
$ git checkout --archivo #deshacer cambios
$ git checkout .
```

## Diferencias y cambios

```bash
$ git log -- <archivo>
$ git log
commit 4c49bd6e3395eec5b5f70e455770b197a4103834 (HEAD -> master, origin/master, origin/HEAD)
Author: diegobollini <diego.bollini@protonmail.com>
Date:   Sat Apr 11 18:57:25 2020 -0300

    nuevas notas secciones finales

commit de6096895cea1bc5f6ddfc0968b355b5842d7bb0
Author: Diego Bollini <diego.bollini@protonmail.com>
Date:   Wed Mar 25 00:09:01 2020 -0300

    revisión estilo md
```

```bash
$ git log --oneline -- <archivo>
$ git log --oneline #versión resumida, sólo títulos de commits
4c49bd6 (HEAD -> master, origin/master, origin/HEAD) nuevas notas secciones finales
de60968 revisión estilo md
59af6bf update de notas
602db73 rebase, head y referencias relativas
064141e Agrego carpeta de Lecturas y nota de Por un Scrum popular
```

```bash
$ git log -p
commit 4c49bd6e3395eec5b5f70e455770b197a4103834 (HEAD -> master, origin/master, origin/HEAD)
Author: diegobollini <diego.bollini@protonmail.com>
Date:   Sat Apr 11 18:57:25 2020 -0300

    nuevas notas secciones finales

diff --git a/Lecturas/Por un Scrum Popular.md b/Lecturas/Por un Scrum Popular.md
index 6bbf9e7..88b5f4c 100644
--- a/Lecturas/Por un Scrum Popular.md
+++ b/Lecturas/Por un Scrum Popular.md
@@ -35,7 +35,56 @@

 ### Artesanos del software

-## Apéndice 1: Scrum
+
+### Amebas organizacionales
```

```bash
$ git checkout 4c49bd6e3395eec5b5f70e455770b197a4103834
#el repo local debe estar "limpio" para volver a este estado
$ git checkout master #última revisión, para no hacer commit y pisar todo luego de un checkout
```

## Branches

```bash
$ git branch testdiseño
$ git checkout testdiseño #HEAD
$ git checkout master #master = rama por defecto, origin = nombre del repo por defecto
$ git merge testdiseño
$ git branch -d testdiseño
```

## Repositorios y referencias remotas

```bash
$ git clone https://github.com/diegobollini/cosas_que_aprendo.git
$ git pull #bajar cambios
$ git push #subir cambios
$ git remote add origin https://github.com/diegobollini/cosas_que_aprendo.git
```

```bash
$ git merge user/master
$ git pull #para sumar los commits de user a mi repositorio master
```

## Buenas Prácticas

- commits periódicos y reducidos (reduce errores, más fácil mantener actualizado, etc.)
- buenas descripciones (primer línea como título, renglón, párrafo)
- commits atómicos (no incluir distintas funcionalidades)
- no hacer commits de cambios en progreso
