# Git

_Software de control de versiones diseñado por Linus Torvalds, pensando en la eficiencia y la confiabilidad del mantenimiento de versiones de aplicaciones cuando estas tienen un gran número de archivos de código fuente._

- [Sitio oficial](https://git-scm.com/) / [Documentación](https://git-scm.com/docs/)
- [Video: PeladoNerd](https://www.youtube.com/watch?v=kEPF-MWGq1w)
- [Learning Git Branching](https://learngitbranching.js.org/) — app interactiva para practicar branches, merge y rebase visualmente

## Glosario básico

- **Repositorio**: carpeta con los archivos del proyecto y su historial (`.git/`)
- **Commit**: conjunto de cambios que se persiste en el historial
- **Staging**: área intermedia donde se preparan los cambios antes de commitear
- **Branch**: línea de desarrollo independiente
- **HEAD**: puntero al commit sobre el que se está trabajando
- **Remoto**: copia del repositorio alojada en otro lado (GitHub, GitLab, etc.), generalmente llamada `origin`

## Setup inicial

```bash
$ git --version
git version 2.39.2
$ git config --global user.name "diegobollini"
$ git config --global user.email "diego.bollini@protonmail.com"
$ git config --list
user.name=diegobollini
user.email=diego.bollini@protonmail.com
```

## Iniciar un repositorio

```bash
$ git init
Inicializado repositorio Git vacío en /home/diego/mirepositorio/.git/
$ touch privado.txt # por ejemplo, para cargar credenciales
$ nano .gitignore # agrego privado.txt para que git lo ignore (pueden ser carpetas, extensiones, etc.)
$ git status
En la rama master
No hay commits todavía
Archivos sin seguimiento:
    (usa "git add <archivo>..." para incluirlo a lo que se será confirmado)
    .gitignore
```

## Agregar, quitar del tracking y commitear

```bash
$ git add archivo        # un archivo puntual
$ git add .              # todos los archivos del directorio
$ git add -A             # todos los archivos del repo
$ git rm --cached [archivo o carpeta] # para que git deje de trackearlo (sin borrarlo del disco)
$ git commit -m "Empezando mi primer repositorio desde la línea de comandos"
[master (commit-raíz) 4554c53] Empezando mi primer repositorio desde la línea de comandos
 9 files changed, 191 insertions(+)
```

## Ver el historial y las diferencias

```bash
$ git log
$ git log --oneline              # versión resumida, solo títulos de commit
4c49bd6 (HEAD -> master, origin/master, origin/HEAD) nuevas notas secciones finales
de60968 revisión estilo md
59af6bf update de notas
$ git log -- <archivo>           # historial de un archivo puntual
$ git log -p                     # incluye el diff de cada commit
$ git diff                       # cambios sin stagear
```

Para descartar cambios locales:

```bash
$ git checkout -- archivo   # deshace los cambios de un archivo puntual
$ git checkout .            # deshace todos los cambios sin stagear
```

## Trabajar con un repositorio existente

```bash
$ git clone https://github.com/usuario/repo.git
$ nano index.html                # edito un archivo existente
$ git status                     # muestra el archivo modificado
$ git diff                       # diferencias contra la versión del repo
$ git add index.html
$ git commit -m "Agregando unas líneas"
$ git pull origin master         # bajar la última versión, siempre al arrancar a trabajar
$ git push origin master         # subir los cambios
```

## Branches

Para no pisarse al trabajar entre varias personas a la vez:

```bash
$ git branch nuevafeature       # crea la rama
$ git checkout nuevafeature     # cambia a la rama
Cambiado a rama 'nuevafeature'
$ git branch -a                 # lista todas las ramas (incluye remotas)
$ git branch -d nuevafeature    # borra la rama (falla si tiene cambios sin mergear)
$ git branch -D nuevafeature    # borra la rama a la fuerza
```

Merge (crea un commit especial con dos padres, o hace fast-forward si no hubo divergencia):

```bash
$ git push -u origin nuevafeature   # publica la rama con los cambios propios
$ git branch --merged               # qué ramas ya están mergeadas a la actual
$ git checkout master
$ git merge nuevafeature
Updating 388b3ca..79678c1
Fast-forward
 index.html | 4 +++-
 1 file changed, 3 insertions(+), 1 deletion(-)
$ git push origin --delete nuevafeature   # borrar la rama también en el remoto
```

## Rebase

Copia un conjunto de commits y los reaplica sobre otra base, en vez de generar un commit de merge:

```bash
$ git rebase master        # desde otra rama, copia sus commits sobre la punta de master
$ git rebase nuevafeature  # desde master, si nuevafeature es rama ancestra, las iguala de nivel
```

## HEAD y referencias relativas

```bash
# HEAD siempre apunta al commit más reciente de la rama activa
# "detachear" = pasar a apuntar a un commit puntual en vez de a una rama
$ git checkout [hash del commit]   # HEAD queda apuntando directo a ese commit
$ git checkout master              # vuelve a apuntar a la rama, evita quedarse en detached HEAD
```

```bash
$ git log   # los hashes se pueden abreviar con los primeros caracteres (ej: fed2 en vez de fed2da64c0efc529...)
$ git checkout master^    # el commit padre del que estoy parado
$ git checkout master^^   # dos commits "hacia atrás"
$ git checkout master~3   # tres commits "hacia atrás"
```

## Repositorios remotos (GitHub, GitLab, etc.)

Los comandos son los mismos sea cual sea el host:

```bash
$ git clone git@github.com:usuario/repo.git
$ git remote add origin https://github.com/usuario/repo.git   # si el repo local todavía no tiene remoto
$ git pull    # bajar cambios
$ git push    # subir cambios
$ git merge user/master && git pull   # para sumar los commits de otra persona a mi rama
```

## Buenas prácticas

- Commits periódicos y reducidos: reducen errores y son más fáciles de revisar y revertir
- Buenas descripciones: primera línea como título corto, después un párrafo si hace falta más contexto
- Commits atómicos: no mezclar distintas funcionalidades o cambios no relacionados en un mismo commit
- No commitear trabajo a medio hacer (para eso están los branches, o `git stash`)
