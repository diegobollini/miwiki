---
layout: page
parent: SRE & SysAdmin
title: docker - SSOT
permalink: /docker-full/
---

# Guía full de docker

## Recursos

- [Documentación oficial](https://docs.docker.com/)
- [Techworld with Nana: Docker Tutorial for Beginners](https://www.youtube.com/watch?v=3c-iBn73dDE)
- [Amigoscode: Docker Tutorial for Beginners](https://www.youtube.com/watch?v=p28piYY_wv8)
- [Docker For Beginners: From Docker Desktop to Deployment](https://www.youtube.com/watch?v=i7ABlHngi1Q)

## Instalar docker, docker-compose

```bash
# Desinstalar todo para empezar de cero:
$ apt-get remove docker docker-engine docker.io containerd runc
$ apt-get update
# Instalar dependencias:
$ apt-get install \
 apt-transport-https \
 ca-certificates \
 curl \
 gnupg-agent \
 gnupg \
 lsb-release \
 software-properties-common
# Descargar key:
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
$ apt-key fingerprint 0EBFCD88
# Agrego el repositorio (IMPORTANTE: ver ubuntu base):
$ echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu bionic stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
$ apt update
# Instalar:
$ apt install docker-ce docker-ce-cli containerd.io pigz
$ docker -v
Docker version 20.10.5, build 55c4c88
```

Instalación de docker-compose:

```bash
# Chequear latest release: https://github.com/docker/compose/releases
$ curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ chmod +x /usr/local/bin/docker-compose
$ docker-compose -v
docker-compose version 1.17.1, build unknown
```

### Adicionales post-instalación Linux

- [Documentación](https://docs.docker.com/engine/install/linux-postinstall/)

```bash
$ groupadd docker
# para ejecutar docker como sudo
$ usermod -aG docker $USER
# para chequear que esté todo OK
$ docker run hello-world
$ systemctl enable docker
```

## Comandos y conceptos básicos

- image: aplicación
- container: ambiente en proceso (running) para una imagen
- `docker --version`: identify the currently installed version of Docker on the host system
- `docker ps`: list all running containers
- `docker images`: list locally stored images
- `docker login`: login into your Dockerhub account
- `docker push <username/imagename>`: upload an image to your remote Dockerhub repository
- `docker pull <imagename>`: download images from Dockerhub
- `docker build <path/to/docker/file>`: generate an image from the specified Docker file
- `docker run -it -d <imagename>`: create a container from the built image
- `docker stop <container id>`: halt the running of the defined container
- `docker rm <container id>`: delete a stopped container
- `docker rmi <imageid>`: delete the specified image ID from local storage.

### Pruebas iniciales

```bash
$ docker help
$ docker pull hello-world # si no existe localmente, la descarga (latest por defecto)
$ docker pull alpine:3.12.3 # imagen:<tag o versión>
$ docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
alpine        3.12.3    389fef711851   2 weeks ago     5.58MB
hello-world   latest    bf756fb1ae65   12 months ago   13.3kB
$ docker run alpine:3.12.3 # para lanzar el container a partir de esta imagen
# Elegí una imagen muy básica que no queda en ejecución, sino que hace "running y stop"
$ docker ps # running containers
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
$ docker ps -a # Show all containers (default shows just running)
CONTAINER ID   IMAGE           COMMAND               CREATED          STATUS                      PORTS     NAMES
eefa0b7a4d80   alpine:3.12.3   "/bin/sh"             20 seconds ago   Exited (0) 19 seconds ago             vibrant_cray
fb5a9e770fd9   alpine          "/bin/sh"             37 seconds ago   Exited (0) 36 seconds ago             charming_nobel
cba2fecfd27d   hello-world     "Hola Mundo"          5 hours ago      Created                               festive_mccarthy
45d927ab4160   hello-world     "echo 'Hola Mundo'"   5 hours ago      Created                               intelligent_benz
94666fd51685   hello-world     "/hello"              5 hours ago      Exited (0) 5 hours ago                upbeat_kepler
# pulls image and start container (pull + start)
$ docker run alpine
# detach mode, que en este caso es indistinto. Ver casos de nginx, redis, etc.
$ docker run -d alpine
# en caso de estar running
$ docker stop fb5a9e770fd9
$ docker start fb5a9e770fd9 # para ejecutar el mismo container
# --name para definirle un nombre al container
$ docker run -d -p 8080:80 --name container-nginx nginx
989c9293a88b9cdeb82a2721e462749882f9f9f8ab71ff958e1655cb1698c794
$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                  NAMES
989c9293a88b   nginx          "/docker-entrypoint.…"   5 seconds ago    Up 4 seconds    0.0.0.0:8080->80/tcp   container-nginx
```

Aprendiendo sobre puertos con la imagen de nginx:

```bash
$ docker run nginx
$ docker run nginx:1.18.0
$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS     NAMES
6e7f4edd427a   nginx:1.18.0   "/docker-entrypoint.…"   9 seconds ago    Up 8 seconds    80/tcp    determined_mirzakhani
6fbb23d33ee0   nginx          "/docker-entrypoint.…"   38 seconds ago   Up 34 seconds   80/tcp    suspicious_chaplygin
```

- múltiples containers en equipo host, pero sólo ciertos puertos disponbiles en mi equipo
- por lo tanto se deben "bindear" ambos puertos (container <> host), sin repetir puertos en host  
  Entonces volviendo al caso de nginx:

```bash
$ docker run -d -p 8080:80 nginx
$ docker run -d -p 8090:80 nginx:1.18.0
$ docker ps
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS          PORTS                  NAMES
859360ae101d   nginx:1.18.0   "/docker-entrypoint.…"   8 seconds ago    Up 6 seconds    0.0.0.0:8090->80/tcp   optimistic_murdock
c7554f1ffc8d   nginx          "/docker-entrypoint.…"   32 seconds ago   Up 30 seconds   0.0.0.0:8080->80/tcp   happy_spence
```

Tanto desde localhost:8080 (0.0.0.0:8090->80/tcp) como localhost:8090, desde el navegador se observa el "Welcome to nginx!"

### Debugging Containers

```bash
$ docker logs c7554f1ffc8d
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
/docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
...
$ docker logs optimistic_murdock
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
...
$ docker exec -it 989c9293a88b /bin/bash # -it: interactive terminal
/# pwd
/
root@989c9293a88b:/# ls
bin  boot  dev docker-entrypoint.d  docker-entrypoint.sh  etc home ...
```

## Práctica: Youtube Stats React App

Siguiendo el video de [Travis Media](https://www.youtube.com/watch?v=i7ABlHngi1Q), voy a intentar hacer deploy de esta app: [YouTube Stats React App](https://github.com/rodgtr1/youtube-stats).

- fork del repositorio
- configurar API YouTube Data API v3 en [GCP](https://www.slickremix.com/docs/get-api-key-for-youtube/)
- copiar key en .env del repositorio / app [youtube-stats](https://github.com/diegobollini/youtube-stats)
- seguir el video para entender el Dockerfile - [Anatomía de un Dockerfile](https://gist.github.com/adamveld12/4815792fadf119ef41bd)

Entonces, desde el directorio donde se encuentra el Dockerfile (y todo el repositorio):

```bash
# Importante estar logueado en docker hub
$ docker login
$ docker build . -t youtubereactapptest # -t para taggear la imagen e identificarla
# Step x/8 (justamente la cantidad de acciones que están en el Dockerfile)
Successfully built 0907ec65cbff
Successfully tagged youtubereactapptest:latest
$ docker images
REPOSITORY            TAG         IMAGE ID       CREATED          SIZE
youtubereactapptest   latest      343d8c0ffaa9   36 seconds ago   1.25GB
$ docker run --rm -it -p 3000:3000/tcp youtubereactapptest:latest
$ docker ps
CONTAINER ID   IMAGE                        COMMAND                  CREATED         STATUS         PORTS                    NAMES
1a4c010c1545   youtubereactapptest:latest   "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:3000->3000/tcp   beautiful_heyrovsky
```

Con el container running --> [http://localhost:3000](http://localhost:3000) !!!!

- por ejemplo se puede testear con el id del tutorial: i7ABlHngi1Q

```
Info
Channel Title: Travis Media
Video Title: Docker For Beginners: From Docker Desktop to Deployment
Views: 319661
```

## Práctica: Wordpress con docker-compose

- múltiples containers: WP files + PHP + apache / nginx + DB
- copiar la plantilla de la [documentación oficial](https://docs.docker.com/compose/wordpress/)
- ver `docker-compose.yml`
- revisar las imagenes de cada service: [wordpress](https://hub.docker.com/_/wordpress) + [mysql](https://hub.docker.com/_/mysql)

```bash
$ mkdir my_wordpress
$ cd my_wordpress
$ nano docker-compose.yml # Ver plantilla oficial
# Agrego un volumen para que persistan en el host los archivos de WP
    volumes:
      - ./wp-content/:/var/www/html
$ docker-compose up -d
# Si no existen en local, descarga las imágenes
$ ls -ls
4 drwxr-xr-x 2 root     root     4096 abr  4 19:46 db_data
4 -rw-rw-r-- 1 diego    diego     617 abr  4 19:45 docker-compose.yml
4 drwxr-xr-x 5 www-data www-data 4096 abr  4 19:46 wp-content
$ docker ps
CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS         PORTS                  NAMES
c990ccd26d20   wordpress:latest   "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:8000->80/tcp   wordpress_docker_wordpress_1
c845e8384fa5   mysql:5.7          "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   3306/tcp, 33060/tcp    wordpress_docker_db_1
```

Si accedo a [http://localhost:8000/](http://localhost:8000/):

- primero ejecuta el instalador de WP
- luego ingreso al wp-admin

También se puede observar en VSC con la extensión de Docker:

- containers de WP y mysql running
- volumes wordpress_docker_db_data
- network wordpress_docker_default

## Test deploy: docker hub + digital ocean

- crear [repositorio](https://hub.docker.com/repositories)
- to push a new tag to this repository (login, etc.):

```bash
$ docker login -u diegobollini
#WARNING! Your password will be stored unencrypted
#Configure a credential helper to remove this warning
$ docker images
REPOSITORY            TAG         IMAGE ID       CREATED        SIZE
youtubereactapptest   latest      343d8c0ffaa9   2 hours ago    1.25GB
$ docker tag 343d8c0ffaa9 diegobollini/youtubereactapp-test:latest
$ docker images
REPOSITORY                          TAG         IMAGE ID       CREATED        SIZE
diegobollini/youtubereactapp-test   latest      343d8c0ffaa9   2 hours ago    1.25GB
youtubereactapptest                 latest      343d8c0ffaa9   2 hours ago    1.25GB
$ docker push diegobollini/youtubereactapp-test
```

Se puede ver el repositorio en:
<https://hub.docker.com/repository/docker/diegobollini/youtubereactapp-test>  
To push a new tag to this repository: `docker push diegobollini/youtubereactapp-test:tagname`

### Deploy en Digital Ocean: react app

En un droplet, creado desde cero (en la guía usan una imagen con docker preinstalado) o uno existente:

```bash
$ ssh root@165.227.69.98
All ports are BLOCKED except 22 (SSH), 2375 (Docker) and 2376 (Docker)
$ docker -v
Docker version 19.03.13, build 4484c46d9d
$ docker login -u diegobollini
$ docker pull diegobollini/youtubereactapp-test:latest
$ docker images
REPOSITORY                          TAG                 IMAGE ID            CREATED             SIZE
diegobollini/youtubereactapp-test   latest              343d8c0ffaa9        42 hours ago        1.25GB
$ docker run --rm -it -p 3000:3000/tcp diegobollini/youtubereactapp-test:latest
Compiled successfully!
You can now view youtube-app in the browser.
```

Entonces desde el navegador: <http://165.227.69.98:3000/> !!!

### Deploy en Digital Ocean: wordpress con docker-compose

## Demo - Workflow

- developing a JavaScript app + mongo DB
- JS --> git commit --> CI/CD --> app + docker image --> docker repository
- dev servers pulls images (mongodb + app)
- Proyecto = JS + nodejs + mongodb (express UI)
- [Repositorio demo app](https://gitlab.com/diegobollini/techworld-js-docker-demo-app)
- [imagen mongo](https://hub.docker.com/_/mongo/)
- [imagen mongo-express](https://hub.docker.com/_/mongo-express/)

```bash
$ docker pull mongo
$ docker pull mongo-express
# docker network: cuando están dentro de la misma red, los containers pueden conectarse a partir del nombre. Cuando están "fuera", se utiliza localhost:port (cuando quiera acceder a la app desde el navegador)
$ docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
3465982265d1   bridge    bridge    local
2d841aa4cdf5   host      host      local
bfc073fee409   none      null      local
$ docker network create mongo-network
5080ad078f2bd5a50aad5bca19a851db0a57af9691c57d48883d5790eab606fe
$ docker network ls
NETWORK ID     NAME            DRIVER    SCOPE
5080ad078f2b   mongo-network   bridge    local
...
```

### Lanzando los containers (ver variables de cada imagen)

```bash
# Primero el container de mongodb
$ docker run -p 27017:27017 -d -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret --name mongodb --net mongo-network  mongo
$ docker logs mongodb # para chequear que esté todo OK
# Luego mongo express para administrar la BD
$ docker run -d -p 8081:8081 -e ME_CONFIG_MONGODB_ADMINUSERNAME=mongoadmin -e ME_CONFIG_MONGODB_ADMINPASSWORD=secret --net mongo-network --name mongo-express -e ME_CONFIG_MONGODB_SERVER="mongodb" mongo-express
# Mongo Express server listening at http://0.0.0.0:8081
# Database connected
# Admin Database connected
```

Accedo a mongo-express desde el navegador (BD admin, config, local por default) y creo la BD "user-account" para poder conectar la app:

```bash
$ docker ps # para chequear que esté todo OK (ver extensión en visual studio)
CONTAINER ID   IMAGE           COMMAND                  CREATED         STATUS          PORTS                      NAMES
52484c5dcb10   mongo-express   "tini -- /docker-ent…"   6 minutes ago   Up 6 minutes    0.0.0.0:8081->8081/tcp     mongo-express
4588a6c184ce   mongo           "docker-entrypoint.s…"   14 hours ago    Up 13 minutes   0.0.0.0:27017->27017/tcp   mongodb
```

Acá a lo mejor la compliqué, pero como no use las mismas variables que en el video, cambié las credenciales <user:password> en `server.js` de acuerdo a las definidas al lanzar el contenedor.

- la app JS claramente tiene más código, se conecta a la BD, etc., etc. pero no lo domino aun y no lo analizo en detalle.
- en la BD user-account, crear db.collection=users.

### App node

Como en la guía que estoy siguiendo omiten esta etapa, combino con [este video de Travis Media](https://www.youtube.com/watch?v=i7ABlHngi1Q) donde hace deploy de una app con node.

- preparar Dockerfile (ver sección) y desde la línea de comandos (en esa carpeta):
- desde la carpeta donde esté guardado:
  $ docker build . -t demoapp

#### Dockerfile

Revisar archivo del proyecto [Docker demo app](https://gitlab.com/diegobollini/techworld-js-docker-demo-app/-/blob/master/Dockerfile) de la guía Techworld with Nana.

<https://youtu.be/3c-iBn73dDE?t=4425>
