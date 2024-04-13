---
layout: page
title: docker - Curso introductorio Acamica
# permalink: /creative_code/
parent: SRE & SysAdmin
---

# Introducción a Docker

## Instalar Docker

```bash
$ sudo pacman -Syu
$ sudo pacman -S docker
# tuve que hacer reboot porque no levantaba el daemon
$ sudo systemctl start docker
$ sudo systemctl enable docker
$ sudo docker version
Client:
 Version:           19.03.8-ce
$ sudo docker info
```

## Ejecutar Containers

```bash
$ sudo docker run hello-world #cada vez que se ejecuta run, levante un container nuevo
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world

$ sudo docker ps -a #-a muestra contenedores "históricos"
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
94390bb9a9e8        hello-world         "/hello"            5 minutes ago       Exited (0) 5 minutes ago                       busy_panini

$ sudo docker rm 94390bb9a9e8
$ sudo docker run --name testeando hello-world #tag --name para nombrar al contenedor y no depender del id
$ sudo docker logs testeando #devuelve los logs relacionados a "testeando"
```

## Modo interactivo

```bash
$ sudo docker run ubuntu
$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
f250bf82e105        ubuntu              "/bin/bash"         11 seconds ago      Exited (0) 9 seconds ago
- Exited: ejecuta el comando /bin/bash y "sale"

$ sudo docker run -it ubuntu #i = interactivo, t = terminal
root@77d9923a240c:/#
	# cat /etc/lsb-release
	DISTRIB_ID=Ubuntu
	DISTRIB_RELEASE=18.04
	DISTRIB_CODENAME=bionic
	DISTRIB_DESCRIPTION="Ubuntu 18.04.4 LTS"
```

## Servicios: mongo db

```bash
$ sudo docker run --name db -d mongo #-d = detach (background)
$ sudo docker ps #al ser un servicio status = UP
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
706ab212176b        mongo               "docker-entrypoint.s…"   2 minutes ago       Up 2 minutes        27017/tcp           db
$ sudo docker logs db

$ sudo docker exec -it db bash
	# mongo
	MongoDB shell version v4.2.5
	# mongo
		> show dbs
	admin   0.000GB
	config  0.000GB
	local   0.000GB

$ sudo docker rm db -f
$ sudo docker stop db
$ sudo docker rm db
```

## Filesystem: Docker volumes

```bash
$ pwd
/home/diego/dockerdata
$ sudo docker run --name db -d -v /home/diego/dockerdata:/data/db mongo #-v = volumen, carpeta local:carpeta container
$ ls
collection-0--4036580556111997286.wt  index-1--4036580556111997286.wt  journal (...)
$ sudo docker exec -it db bash
	root@04ccc40d99af:/# cd /data/db
	root@04ccc40d99af:/data/db# ls
		collection-0--4036580556111997286.wt (...)
```

## Conectarse desde una app

```bash
$ sudo git clone https://github.com/gvilarino/docker-testing
$ pwd
/home/diego/dockerdata/docker-testing
$ sudo npm install
$ sudo npm audit fix
$ node index.js
Server listening at *: 3000

$ cat index.js
// Connection URL
const mongoUrl = process.env.MONGO_URL || 'mongodb://db:27017/test';
```

### Espejar (Bindear) puertos

```bash
$ sudo docker run -d --name db -p 27017:27017 mongo #puertos = local:container
$ sudo docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
e6d278baf504        mongo               "docker-entrypoint.s…"   7 seconds ago       Up 6 seconds        0.0.0.0:27017->27017/tcp   db

BOOM: MongoError: failed to connect to server [db:27017] on first connect [Error: getaddrinfo ENOTFOUND db
    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:66:26) {
  name: 'MongoError',
  message: 'getaddrinfo ENOTFOUND db'
}]

#El archivo index.js puede que tenga un error, en URL cambié db por localhost
// Connection URL
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/test';

	-> Me conecté a la DB!
```

### Puedo testear mi app con distintas versiones de mongo

```bash
$ sudo docker run -d --name db -p 27017:27017 mongo:3.0
	http://localhost:3000/
	Me conecté a la DB!
```

## Imágenes y el filesystem por capas

```bash
$ sudo docker images
$ sudo docker rmi mongo:3.0 #borrar imagen (ver capas)
Untagged: mongo:3.0
Untagged: mongo@sha256:2eae1f99d5e49286d5e34a153c6ffaf25b038731e1cfbd786712ced672e8e575
Deleted: sha256:fdab8031e2525c2760129670f30737557f82fc8ea1e6410333284bdfa1dd57b0
Deleted: sha256:6fa57df9b8295f665bde10112fc6c351598e74d44b3065720c61da946d5130c9
Deleted: sha256:b3f2775ce1d1873bfd47213a1b661af1ca064168d562dd8e290cbf5356ed286a
(...)

$ sudo docker run -it --name versiones ubuntu bash #creo un archivo, touch este-archivo-es-nuevo
$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                     PORTS               NAMES
042701bb71ac        ubuntu              "bash"              40 seconds ago      Exited (0) 6 seconds ago                       versiones

$ sudo docker commit versiones imagennueva
sha256:7541b4e3aef740d3ebeedba4206f70e5d89f0f41f25ec733a8062a3f44f09f29 #hash de esta nueva imagen / capa
$ sudo docker images #vemos las distintas imagenes (ver diff)
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
imagennueva         latest              7541b4e3aef7        39 seconds ago      64.2MB
ubuntu              latest              4e5021d210f6        3 weeks ago         64.2MB

$ sudo docker run -it --name ubuntu2 --rm imagennueva bash
root@0a90e77260cb:/# ls
bin  boot  dev  este-archivo-es-nuevo  etc
```

## Docker registry y docker hub

```bash
#si no se especifica tag de la version = latest
$ sudo docker pull alpine:3.8.5
$ sudo docker pull alpine:3.10.4
3.10.4: Pulling from library/alpine
4167d3e14976: Pull complete
Digest: sha256:7c3773f7bcc969f03f8f653910001d99a9d324b4b9caa008846ad2c3089f5a5f
Status: Downloaded newer image for alpine:3.10.4
docker.io/library/alpine:3.10.4

$ sudo docker pull node:4.4.7 #library pública + tag
$ sudo docker images
#Si ahora bajo latest de node, va a bajar las capas "diff" a partir de 4.4.7
```

## Docker build y Docker files

```bash
$ sudo docker commit versiones imagennueva #no es la opción más práctica

$ pwd
/home/diego/dockerdata/docker-testing
$ ls
docker-compose.yml  Dockerfile  index.js  LICENSE  package.json  README.md
$ cat Dockerfile
FROM node:argon #desde qué imagen

COPY [".", "/usr/src/"] #copia archivos desde local al container

WORKDIR /usr/src #posición del filesystem (cd /user/src)

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"] #define el comando por default al hacer run sobre el container

$ cat .dockerignore #para no incluirlo en el build
node_modules
$ sudo docker build -t probando-rev2 . #-t = tag
	Sending build context to Docker daemon  69.12kB
	Step 1/6 : FROM node:argon
	argon: Pulling from library/node
	Step 2/6 : COPY [".", "/usr/src/"]
	Step 3/6 : WORKDIR /usr/src
	Removing intermediate container 3a6a1fa4db4e
	Step 4/6 : RUN npm install
	mongodb@2.2.36 node_modules/mongodb
	Removing intermediate container c769d62604d4
	Step 5/6 : EXPOSE 3000
	Removing intermediate container abfbc7b16437
	Step 6/6 : CMD ["node", "index.js"]
	Removing intermediate container 12718d534fca
	Successfully built ed6decbfff2a
	Successfully tagged probando:latest

$ sudo docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
probando-rev2       latest              ed6decbfff2a        6 minutes ago       658MB
node                argon               ef4b194d8fcf        23 months ago       653MB
$ sudo docker run -it --rm probando-rev2 bash
root@ae41e2b967d5:/usr/src#

$ sudo docker run -p 3000:3000 probando-rev2
```

## Aprovechando las capas

```bash
$ sudo docker build -t probando-rev2 .
	 ---> Using cache #en cada paso usa el caché del build anterior

#para jugar, edito el mensaje de error de index.js
      res.end('GARRON, ALGO FLAYIO: ' + err)

$ sudo docker build -t probando-rev2 .
#ver caché
```

## Docker push y wrap

```bash
$ sudo docker login

$ sudo docker tag nombrerepositorio diegobollini/nombre_del_proyecto (mismo id de imagen)
$ sudo docker push diegobollini/nombre_del_proyecto
	#sólo pushea las que tengan diff por nosotros, el resto las monta desde library
https://hub.docker.com/u/diegobollini
```

## Linkeando containers

```bash
#De la misma manera que con -v o -p, el flag --link considera lo de la izquierda del dos puntos (:) como lo que conoce el host (en este caso, el nombre del container a linkear) y a la derecha lo relevante al container a crear (en este caso, cómo el nuevo container conocerá a aquel a quien está siendo linkeado)

$ sudo docker build -t appbuild .
$ sudo docker run -d --name db mongo

// Connection URL
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/test';

$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
6d9493f447eb        mongo               "docker-entrypoint.s…"   19 minutes ago      Up 19 minutes       27017/tcp           db
$ sudo docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
appbuild            latest              85a854a599d0        9 minutes ago       658MB
mongo               latest              c5e5843d9f5f        2 weeks ago         387MB
node                argon               ef4b194d8fcf        23 months ago       653MB

$ sudo docker run --name app -d --link db:mongoalias -e MONGO_URL=mongodb://mongoalias/test -p 3000:3000 appbuild
```

## Introducción a Docker compose

```bash
$ cat docker-compose.yml
version: '2'

services:
  app:
    image: 2deb9f96eb0b #la que hice build con el dockerfile
    environment:
      MONGO_URL: "mongodb://db/test"
    depends_on: #la app "depende" de la base de datos, por lo que debe arrancar primero
      - db
    ports:
      - "3000:3000"

  db:
    image: mongo

$ sudo docker-compose up
Creating network "docker-testing_default" with the default driver
Creating docker-testing_db_1 ... done
Creating docker-testing_app_1 ... done
Attaching to docker-testing_db_1, docker-testing_app_1

localhost:3000
Me conecté a la BD!
```

## Trabajando con Docker-compose

```bash
$ cat docker-compose.yml
version: '2'

services:
  app:
    build: .
   #image: 2deb9f96eb0b
    environment:
      MONGO_URL: "mongodb://db/test"
    depends_on:
      - db
    ports:
      - "3000:3000"

  db:
    image: mongo

$ sudo docker-compose build
db uses an image, skipping
Building app
(...)

$ sudo docker images
REPOSITORY           TAG                 IMAGE ID            CREATED             SIZE
docker-testing_app   latest              6a8d6ce8ead7        2 minutes ago       658MB

$ sudo docker-compose up -d
Starting docker-testing_db_1 ... done
Starting docker-testing_app_1 ... done
$ sudo docker-compose ps
        Name                     Command             State           Ports
-----------------------------------------------------------------------------------
docker-testing_app_1   node index.js                 Up      0.0.0.0:3000->3000/tcp
docker-testing_db_1    docker-entrypoint.sh mongod   Up      27017/tcp

$ sudo docker-compose logs app
Attaching to docker-testing_app_1
app_1  | Server listening at *: 3000
app_1  | Server listening at *: 3000

$ sudo docker-compose stop app
Stopping docker-testing_app_1 ... done
$ sudo docker-compose ps
        Name                     Command              State       Ports
-------------------------------------------------------------------------
docker-testing_app_1   node index.js                 Exit 137
docker-testing_db_1    docker-entrypoint.sh mongod   Up         27017/tcp

$ sudo docker-compose down
Stopping docker-testing_db_1 ... done
Removing docker-testing_app_1 ... done
Removing docker-testing_db_1  ... done
Removing network docker-testing_default
$ sudo docker-compose ps
Name   Command   State   Ports
------------------------------
```
