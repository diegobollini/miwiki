---
layout: page
parent: SRE & SysAdmin
title: kubernetes - manual
# permalink: /docker-full/
---

# Apuntes y notas sobre Kubernetes

- [Guía NetworkChuck 29'](https://www.youtube.com/watch?v=7bA0gTroJjw)
- [Pelador Nerd - Lista Kubernetes](https://youtu.be/oTf0KxK1QNo?list=PLqRCtm0kbeHA5M_E_Anwu-vh4NWlgrOY_)
- [Kubernetes 2021 - De novato a Pro! 01:30'](https://www.youtube.com/watch?v=DCoBcpOA7W4)
- [Quickstart GCP](https://cloud.google.com/kubernetes-engine/docs/quickstart)

## LAB Docker 101

- [you need to learn Docker RIGHT NOW!! // Docker Containers 101](https://www.youtube.com/watch?v=eGz9DS-aIeY)
- [Linode](https://cloud.linode.com)

```bash
# Usando una imagen con docker preinstalado
# Local
$ ssh diego@ip
# Servidor
$ docker -v
Docker version 20.10.7, build f0df350
$ docker pull centos
$ docker run -t -d --name contenedor_centos centos
...
$ docker pull alpine
Using default tag: latest
latest: Pulling from library/alpine
...
$ docker run -t -d --name co_alpine alpine
$ docker ps
CONTAINER ID   IMAGE     COMMAND       CREATED         STATUS         PORTS     NAMES
08059cef8e38   alpine    "/bin/sh"     6 seconds ago   Up 6 seconds             co_alpine
8dae656478bc   centos    "/bin/bash"   2 minutes ago   Up 2 minutes             contenedor_centos
$ docker exec -it co_alpine sh
/ # ls
bin    etc    lib    mnt    proc

# Caso: https://hub.docker.com/r/thenetworkchuck/nccoffee
$ docker pull thenetworkchuck/nccoffee:frenchpress
$ docker run -t -d -p 80:80 --name lab_chuck thenetworkchuck/nccoffee:frenchpress
cfe38f9cf5631ce5d626358533bfe39630ea303f9b250fff298807cba05076b9
$ docker ps
CONTAINER ID   IMAGE                                  COMMAND                  CREATED          STATUS          PORTS                               NAMES
cfe38f9cf563   thenetworkchuck/nccoffee:frenchpress   "nginx -g 'daemon of…"   11 seconds ago   Up 10 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp   lab_chuck
## Entonces: http://ip/ > Welcome to NetworkChuck Coffee!
$ docker stop co_alpine
$ docker start co_alpine
$ docker stats
CONTAINER ID   NAME        CPU %     MEM USAGE / LIMIT     MEM %     NET I/O     BLOCK I/O   PIDS
cfe38f9cf563   lab_chuck   0.00%     2.102MiB / 1.948GiB   0.11%     906B / 0B   0B / 0B     2
08059cef8e38   co_alpine   0.00%     676KiB / 1.948GiB     0.03%     726B / 0B   0B / 0B     1
```

## Kubernetes > Orquestador

- Declarativo
- Cluster / Master
  - Control plane
    - kubernetes api server
    - scheduler
    - controlled manager
    - etcd (BD)
  - Worker nodes: OS > Docker > Kubelet + Kube-Proxy
- [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)

  - kubectl version (1.20) <= cluster version (1.21)

- Proveedor cloud --> crear cluster
- LAB Linode: Linode 2 GB Plan, 1 CPU, 50 GB Storage x 3 nodes
- kubernets api endpoint: https://1150e9e0-80a4-433f-82f4-57ab9c758437.us-west-1.linodelke.net:443
- Kubeconfig: your_file.yaml

### Instalar kubectl

```bash
$ curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
$ curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
$ echo "$(<kubectl.sha256) kubectl" | sha256sum --check
kubectl: OK
$ install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
$ kubectl version --client=true
Client Version: version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.2"...
```

```bash
# Conectar al Cluster
# Ver archivo yaml del cluster, descargar, copiar contenido, etc.
$ nano kubeconfig.yaml
$ export KUBECONFIG=kubeconfig.yaml
$ kubectl get nodes
NAME                          STATUS   ROLES    AGE   VERSION
lke31149-46863-60e8c28844d2   Ready    <none>   14m   v1.21.1
lke31149-46863-60e8c2886be5   Ready    <none>   13m   v1.21.1
lke31149-46863-60e8c288905a   Ready    <none>   13m   v1.21.1
$ kubectl cluster-info
Kubernetes control plane is running at https://1150e9e0-80a4-433f-82f4-57ab9c758437.us-west-1.linodelke.net:443
KubeDNS is running at https://1150e9e0-80a4-433f-82f4-57ab9c758437.us-west-1.linodelke.net:443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

PODS: containers en kubernetes (usualmente 1 pod = 1 container).  
Prueba con web app:

```bash
# Crear pod con nombre test a partir de una imagen de docker
$ kubectl run test --image=thenetworkchuck/nccoffee:frenchpress --port=80
pod/test created
$ kubectl get pods
NAME   READY   STATUS    RESTARTS   AGE
test   1/1     Running   0          16s
$ kubectl describe pods
Name:         test
Namespace:    default
Priority:     0
Node:         lke31149-46863-60e8c288905a/192.168.166.218
Start Time:   Fri, 09 Jul 2021 19:00:37 -0300
Labels:       run=test
Annotations:  cni.projectcalico.org/podIP: 10.2.173.193/32
              cni.projectcalico.org/podIPs: 10.2.173.193/32
Status:       Running
IP:           10.2.173.193
...
# Para eliminar pods
$ kubectl delete pods test
pod "test" deleted
```

### Deployment

```bash
# .yaml manifiesto
# kubernetes_test_deployment.yaml
$ kubectl apply -f kubernetes_test_deployment.yaml
deployment.apps/test-deployment created
$ kubectl get pods
NAME                               READY   STATUS    RESTARTS   AGE
test-deployment-769d868d4c-c7zw9   1/1     Running   0          21s
test-deployment-769d868d4c-g7db6   1/1     Running   0          21s
test-deployment-769d868d4c-r6cmx   1/1     Running   0          21s
```

Para editar el deployment (por ejemplo para cambiar cantidad de pods):

```bash
$ kubectl get deployment
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
test-deployment   3/3     3            3           2m5s
# Atención, se edita con vim...
$ kubectl edit deployment test-deployment
# replicas: 6
deployment.apps/test-deployment edited
$ kubectl get pods
NAME                               READY   STATUS    RESTARTS   AGE
test-deployment-769d868d4c-c7zw9   1/1     Running   0          14m
test-deployment-769d868d4c-g7db6   1/1     Running   0          14m
test-deployment-769d868d4c-qcw26   1/1     Running   0          42s
test-deployment-769d868d4c-r6cmx   1/1     Running   0          14m
test-deployment-769d868d4c-sdg9r   1/1     Running   0          42s
test-deployment-769d868d4c-xtmrs   1/1     Running   0          42s

# Para visualizar más info, identificar sobre qué nodos corren, etc.
$ kubectl get pods -o wide
NAME                               READY   STATUS    RESTARTS   AGE    IP             NODE                          NOMINATED NODE   READINESS GATES
test-deployment-769d868d4c-c7zw9   1/1     Running   0          15m    10.2.173.196   lke31149-46863-60e8c288905a   <none>           <none>
test-deployment-769d868d4c-g7db6   1/1     Running   0          15m    10.2.173.195   lke31149-46863-60e8c288905a   <none>           <none>
test-deployment-769d868d4c-qcw26   1/1     Running   0          111s   10.2.66.68     lke31149-46863-60e8c2886be5   <none>           <none>
test-deployment-769d868d4c-r6cmx   1/1     Running   0          15m    10.2.173.194   lke31149-46863-60e8c288905a   <none>           <none>
...
```

### Disponibilizar website (caso Lab)

Deploy service para exponer los pods a partir de manifiesto .yaml:

```bash
$ kubectl apply -f kubernetes_test_service.yaml
service/coffee-service created
# Se crea un NodeBalancers en el cloud provider
$ kubectl get services
NAME             TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)        AGE
coffee-service   LoadBalancer   10.128.160.79   96.126.99.51   80:31546/TCP   35s
kubernetes       ClusterIP      10.128.0.1      <none>         443/TCP        55m
# Entonces > web > 96.126.99.51 > sitio web!!

# Para ver info del servicio (por ejemplo, 6 endpoints = pods definidos en el deployment)
$ kubectl describe services coffee-service
Name:                     coffee-service
Namespace:                default
Labels:                   app=coffee-service
Annotations:              service.beta.kubernetes.io/linode-loadbalancer-throttle: 4
Selector:                 app=nccoffee
Type:                     LoadBalancer
IP Family Policy:         SingleStack
IP Families:              IPv4
IP:                       10.128.160.79
IPs:                      10.128.160.79
LoadBalancer Ingress:     96.126.99.51
Port:                     http  80/TCP
TargetPort:               80/TCP
NodePort:                 http  31546/TCP
Endpoints:                10.2.173.194:80,10.2.173.195:80,10.2.173.196:80 + 3 more...
```

### Editando el deployment

¿Qué sucede si quiero actualizar a partir de una nueva imagen del sitio web?

```bash
$ kubectl edit deployment test-deployment
# replicas: 4
# - image: thenetworkchuck/nccoffee:vacpot
$ kubectl get pods
NAME                               READY   STATUS    RESTARTS   AGE
test-deployment-6c5d7ccb65-d2q7l   1/1     Running   0          49s
test-deployment-6c5d7ccb65-p7fkl   1/1     Running   0          48s
test-deployment-6c5d7ccb65-r4mdn   1/1     Running   0          54s
test-deployment-6c5d7ccb65-zb8fk   1/1     Running   0          53s
# Son 4 nuevos pods, se destruyen los anteriores, se actualizan y se levantan nuevamente
$ kubectl describe services coffee-service
```

### Rancher

- [Web](https://rancher.com/)
- [Intro Pelado Nerd](https://youtu.be/74Qd1Kl79P8)
- [How to Deploy Kubernetes on Linode with Rancher](https://www.linode.com/docs/guides/how-to-deploy-kubernetes-on-linode-with-rancher-2-x/)
- [How to Deploy Apps with Rancher](https://www.linode.com/docs/guides/how-to-deploy-apps-with-rancher-1/)

```bash
# Linode Server
$ ssh root@66.175.219.210
$ apt update && upgrade -y
# Instalar docker
$ apt install apt-transport-https ca-certificates curl software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu  $(lsb_release -cs)  stable"
$ apt-get install docker-ce docker-compose
$ docker --version
$ systemctl start docker
$ systemctl enable docker
# API Token: d97a9aef8795d6b1a9b3c6749231dafcc8c8648558a3989805503e7337731750
```

Instalar Rancher artesanal:

```bash
$ mkdir -p /opt/rancher
$ cd /opt/rancher
$ docker run -d --privileged -p 80:80 -p 443:443 \
--restart=unless-stopped \
-v /opt/rancher:/var/lib/rancher \
rancher/rancher:stable
$ docker ps
CONTAINER ID   IMAGE                    COMMAND           CREATED         STATUS         PORTS                                                                      NAMES
2419094c530f   rancher/rancher:stable   "entrypoint.sh"   5 seconds ago   Up 3 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   hardcore_wescoff
# Rancher web --> 66.175.219.210 --> What's New in 2.5
```

También se puede usar por ejemplo el [docker-compose del Pelado Nerd](https://github.com/pablokbs/peladonerd/blob/master/kubernetes/22/docker-compose.yaml).  
Jugando con Rancher y Kubernetes:

- Tools > Driver > Activate Linode LKE (1.20)

#### minikube

- [Doc](https://minikube.sigs.k8s.io/docs/)

```bash
$ curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb
$ sudo dpkg -i minikube_latest_amd64.deb
$ minikube version
minikube version: v1.22.0
```

### LAB 101 Kubernetes

```bash
# Creo cluster test en Linode y descargo el .yaml
$ export KUBECONFIG=test-nerd-kubeconfig.yaml
$ kubectl get nodes
NAME                          STATUS     ROLES    AGE   VERSION
lke31375-47264-60eccaeb2f07   Ready      <none>   79s   v1.21.1
lke31375-47264-60eccaeb5444   NotReady   <none>   44s   v1.21.1
lke31375-47264-60eccaeb78ef   Ready      <none>   78s   v1.21.1
$ kubectl --help
# Contextos en kubeconfig (en este caso es sólo 1, del cluster test de Linode)
$ kubectl config get-contexts
CURRENT   NAME           CLUSTER    AUTHINFO         NAMESPACE
*         lke31375-ctx   lke31375   lke31375-admin   default
```

#### Lens (kubernetes ide)

- [Web](https://k8slens.dev/)

```bash
# Se descarga la última versión .deb por ejemplo
$ sudo dpkg -i Lens-5.0.2-latest.20210705.2.amd64.deb
```

### Recursos

```bash
# Namespaces: división lógica del cluster, por defecto son los siguientes:
$ kubectl get ns
NAME              STATUS   AGE
default           Active   18m
kube-node-lease   Active   18m
kube-public       Active   18m
kube-system       Active   18m
# Reservados para las distintas herramientas
```

```bash
# Pods: set  de contenedores (en general 1 = 1)
$ kubectl get pods
No resources found in default namespace.
# Para mostrar pods de un namespace, en este caso uno de sistema
$ kubectl -n kube-system get pods
NAME                                      READY   STATUS    RESTARTS   AGE
calico-kube-controllers-b787cc5c6-s8sqv   1/1     Running   0          37m
calico-node-4pmqc                         1/1     Running   0          36m
calico-node-k792t                         1/1     Running   0          35m
calico-node-zdzk6                         1/1     Running   0          36m
...
$ kubectl -n kube-system get pods -o wide
# Más info sobre los pods
$ kubectl -n kube-system delete pod calico-node-4pmqc
```

```bash
# Continuando con un cluster en GCP
$ gcloud container clusters get-credentials cluster-1 --zone us-central1-a --project red-data-317001
$ kubectl get nodes
$ kubectl -n kube-system delete pod calico-node-4pmqc
```

### Manifiestos

Pod: set de contenedores que comparten el namespace (misma IP). Sólo a los efectos prácticos, al ser "descartables", deberíamos deployar deployments justamente.

```yaml
# Buscar el recurso correspondiente y chequear la versión de kubernetes que corresponde
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
    - name: nginx
      image: nginx:alpine
```

Para aplicar manifiesto [Repo](https://github.com/pablokbs/peladonerd/tree/master/kubernetes/35):

```bash
# Si no especifico el ns = default
$ kubectl apply -f 01-pod.yaml
pod/nginx created
$ kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          9s
$ kubectl exec -it nginx -- sh
$ kubectl delete pod nginx
pod "nginx" deleted
$ kubectl get pods
No resources found in default namespace.
# Porque mi manifiesto no indica que debe deployarse nuevamente
$ kubectl apply -f 02-pod.yaml
  # Declarar variables de entorno, obtener IP del host...
  # Asignar recursos con requests (lo que siempre va a tener disponible) y limits
  # readinessProbe y livenessProbe
$ kubectl get pod nginx -o yaml
```

#### Deployments

Template para crear pods:

- [Deployment](https://github.com/pablokbs/peladonerd/blob/master/kubernetes/35/04-deployment.yaml)
  - apiVersion: apps/v1
  - kind: Deployment
  - spec > spec (template para los pods)

```bash
$ kubectl apply -f 04-deployment.yaml
deployment.apps/nginx-deployment created
$ kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-67b567fbb5-d5mst   0/1     Running   0          7s
nginx-deployment-67b567fbb5-xpqkm   0/1     Running   0          7s
# Como el readinessProbe no está respondiendo "200", aun no están Ready 1/1 y no van a recibir tráfico
$ kubectl delete pod nginx-deployment-67b567fbb5-d5mst
pod "nginx-deployment-67b567fbb5-d5mst" deleted
$ kubectl get pods
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-67b567fbb5-mgh7m   0/1     Running   0          15s
nginx-deployment-67b567fbb5-xpqkm   1/1     Running   0          3m20s
# Vuelve a levantar otro pod (replicas = 2)
```

#### Daemonset

- [Repositorio](https://github.com/pablokbs/peladonerd/blob/master/kubernetes/35/03-daemonset.yaml)
- Importante para servicios de monitoreo
- 1 pod en cada nodo (por eso no tiene réplicas)
  - apiVersion: apps/v1
  - kind: DaemonSet

```bash
$ kubectl delete -f 04-deployment.yaml
deployment.apps "nginx-deployment" deleted
$ kubectl apply -f 03-daemonset.yaml
daemonset.apps/nginx-deployment created
$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-deployment-dvkmw   1/1     Running   0          25s
nginx-deployment-gglds   1/1     Running   0          25s
nginx-deployment-mnb95   1/1     Running   0          25s
# 1 Pod para cada nodo, entonces si elimino un pod, lo vuelve a crear en el mismo nodo
```

#### StatefulSet

- además de los pods, tienen un volumen
- por ejemplo para BD
  - apiVersion: apps/v1
  - kind: StatefulSet
  - volumeClaimTemplates

````bash
$ kubectl apply -f 05-statefulset.yaml
statefulset.apps/my-csi-app-set created
$ kubectl describe pod my-csi-app-set-0
# Para ver volumenes
$ kubectl get pvc
```bash

https://youtu.be/DCoBcpOA7W4?t=2808
````
