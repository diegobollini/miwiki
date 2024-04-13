---
layout: page
title: MySQL - Curso introductorio (Acamica)
# permalink: /creative_code/
parent: SRE & SysAdmin
---

# MySQL: Introducción a bases de datos relacionales

## Bases de datos relacionales

- Entidades
- Atributos: definen la información de cada entidad.
- Relaciones: vínculo que permite que dos o más entidades compartan algún atributo.

### Tablas

- Filas
- Columnas

### Claves primarias

- Primary Key: PK, id, autoincremental, identificación unívoca
- Clave subrogada: atributo que se agrega a la tabla
- Clave natural: clave primaria por atributo propio de la tabla / entidad

### Tipos de datos

- [Manual](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)
- Numéricos
  - int = enteros
  - decimal (5,2) = 123,68 = 5 caracteres total, 2 decimales
- booleano (0 / 1)
- Cadenas de caracteres - varchar (16) = cantidad máxima de caracteres
- Fechas - date - datetime

## SQL

- Structured Query Language
- Oracle, **MySQL**, SQL Server

## MySQL

- [Community](https://www.mysql.com/products/community/)
- [Workbench](https://www.mysql.com/products/workbench/)
- [Docker](https://hub.docker.com/_/mysql)

```bash
$ sudo docker run --name test-mysql -e MYSQL_ROOT_PASSWORD=rootpass -d mysql
$ sudo docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                 NAMES
10d6b112a25e        mysql               "docker-entrypoint.s…"   5 seconds ago       Up 3 seconds        3306/tcp, 33060/tcp   test-mysql
$ sudo docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
mysql               latest              9228ee8bac7a        2 weeks ago         547MB
$ sudo docker exec -it test-mysql bash
root@10d6b112a25e:/#
```

### Operaciones, comandos

```sql
# mysql -u root -p
mysql> create database usuarios;
mysql> show databases;
mysql> use usuarios;
Database changed
mysql> CREATE TABLE usuario (
    id int not null auto_increment,
    nombre_de_usuario varchar(20) not null,
    password varchar(20) not null,
    apellido varchar(20),
    edad int,
    primary key (id)
);
mysql> show tables;
+--------------------+
| Tables_in_usuarios |
+--------------------+
| usuario            |
+--------------------+
1 row in set (0.01 sec)

mysql> describe usuario;
+-------------------+-------------+------+-----+---------+----------------+
| Field             | Type        | Null | Key | Default | Extra          |
+-------------------+-------------+------+-----+---------+----------------+
| id                | int         | NO   | PRI | NULL    | auto_increment |
| nombre_de_usuario | varchar(20) | NO   |     | NULL    |                |
| password          | varchar(20) | NO   |     | NULL    |                |
| apellido          | varchar(20) | YES  |     | NULL    |                |
| edad              | int         | YES  |     | NULL    |                |
+-------------------+-------------+------+-----+---------+----------------+
5 rows in set (0.01 sec)
```

### Caso práctico: hospital

```sql
mysql> create database pacientes;
mysql> use pacientes;
mysql> CREATE TABLE paciente (
    id int not null auto_increment,
    nombre_de_usuario varchar(60) not null,
    DNI int not null,
    edad int not null,
    peso decimal(5,2),
    altura decimal(3,2),
    fecha_de_nacimiento date not null,
    ultima_consulta date,
    primary key (id)
);
mysql> describe paciente;
+---------------------+--------------+------+-----+---------+----------------+
| Field               | Type         | Null | Key | Default | Extra          |
+---------------------+--------------+------+-----+---------+----------------+
| id                  | int          | NO   | PRI | NULL    | auto_increment |
| nombre_de_usuario   | varchar(60)  | NO   |     | NULL    |                |
| DNI                 | int          | NO   |     | NULL    |                |
| edad                | int          | NO   |     | NULL    |                |
| peso                | decimal(5,2) | YES  |     | NULL    |                |
| altura              | decimal(3,2) | YES  |     | NULL    |                |
| fecha_de_nacimiento | date         | NO   |     | NULL    |                |
| ultima_consulta     | date         | YES  |     | NULL    |                |
+---------------------+--------------+------+-----+---------+----------------+
8 rows in set (0.00 sec)
```

### Queries (Consultas)

```sql
mysql> show databases;
mysql> use pacientes;
mysql> show tables;
mysql> describe paciente;
mysql> select * from paciente;
mysql> select altura from paciente;
mysql> select altura, edad from paciente;
```

### Scripts SQL

```bash
# from local to container
$ sudo docker cp script.sql test-mysql:/script.sql
```

```sql
CREATE DATABASE paises;
USE paises;
CREATE TABLE `pais` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pais` varchar(50) DEFAULT NULL,
  `continente` varchar(30) DEFAULT NULL,
  `poblacion` numeric(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
```

```sql
mysql> source /script.sql;
Query OK, 1 row affected (0.02 sec)

Database changed
Query OK, 0 rows affected (0.04 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| pacientes          |
| paises             |
| performance_schema |
| sys                |
| usuarios           |
+--------------------+
7 rows in set (0.01 sec)

mysql> use paises;
Database changed
mysql> show tables;
+------------------+
| Tables_in_paises |
+------------------+
| pais             |
+------------------+
1 row in set (0.00 sec)

mysql> describe pais;
+------------+---------------+------+-----+---------+----------------+
| Field      | Type          | Null | Key | Default | Extra          |
+------------+---------------+------+-----+---------+----------------+
| id         | int           | NO   | PRI | NULL    | auto_increment |
| pais       | varchar(50)   | YES  |     | NULL    |                |
| continente | varchar(30)   | YES  |     | NULL    |                |
| poblacion  | decimal(10,0) | YES  |     | NULL    |                |
+------------+---------------+------+-----+---------+----------------+
4 rows in set (0.01 sec)
```

### Caso práctico: Twitter

```bash
$ sudo docker cp mysql-introduccion-actividad-01.sql test-mysql:/script-act01.sql
$ cat mysql-introduccion-actividad-01.sql
```

```sql
CREATE DATABASE `twitter`;

USE `twitter`;

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL,
  `nombre_completo` varchar(40) DEFAULT NULL,
  `cantidad_de_tweets` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `usuario` (`id`, `username`, `nombre_completo`, `cantidad_de_tweets`)
VALUES
	(1,'camipucheta','Camila Pucheta',1234),
	(2,'martulopez','Martina Lopez',9862),
	(3,'lukifalter','Lucas Falter',452),
	(4,'pedro1899','Pedro Martinez',1299),
	(5,'natialterio','Natalia Alterio',7622),
	(6,'camibru','Camila Bruno',3401),
	(7,'orne15','Ornela Cerro',4327),
	(8,'macasanchez','Macarena Sanchez',3224);
```

```sql
mysql> source /script-act01.sql;
Query OK, 1 row affected (0.02 sec)

Database changed
Query OK, 0 rows affected, 2 warnings (0.04 sec)

Query OK, 8 rows affected (0.01 sec)
Records: 8  Duplicates: 0  Warnings: 0
mysql> show databases;
mysql> use twitter;
mysql> show tables;
mysql> describe usuarios;
mysql> select username,nombre_completo from usuario;
+-------------+------------------+
| username    | nombre_completo  |
+-------------+------------------+
| camipucheta | Camila Pucheta   |
| martulopez  | Martina Lopez    |
| lukifalter  | Lucas Falter     |
| pedro1899   | Pedro Martinez   |
| natialterio | Natalia Alterio  |
| camibru     | Camila Bruno     |
| orne15      | Ornela Cerro     |
| macasanchez | Macarena Sanchez |
+-------------+------------------+
8 rows in set (0.00 sec)
```

### Filtrando la información de una tabla

```sql
mysql> select * from usuario where cantidad_de_tweets > 5000;
+----+-------------+-----------------+--------------------+
| id | username    | nombre_completo | cantidad_de_tweets |
+----+-------------+-----------------+--------------------+
|  2 | martulopez  | Martina Lopez   |               9862 |
|  5 | natialterio | Natalia Alterio |               7622 |
+----+-------------+-----------------+--------------------+
2 rows in set (0.00 sec)

mysql> select * from usuario where username = 'camibru';
mysql> select username,cantidad_de_tweets from usuario where username = 'camibru';
mysql> select * from usuario where condición AND condición;
```

### Consultas a BD (ejercicio Amazon)

#### start contenedor, importar script

```bash
$ sudo docker start test-mysql
$ sudo docker cp mysql-amazon.sql test-mysql:/mysql-amazon.sql
```

```sql
CREATE DATABASE `amazon`;

USE `amazon`;

CREATE TABLE `producto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(40) NOT NULL,
  `precio` int NOT NULL,
  `categoria` varchar(40) NOT NULL,
  `pais_venta` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `producto` (`id`, `nombre`, `precio`, `categoria`, `pais_venta`)
VALUES
	(1,'Remera hombre roja',10,'Indumentaria','Colombia'),
	(2,'Iphone 6, 16GB',500,'Tecnología','Estados Unidos'),
	(3,'Florero de vidrio',20,'Hogar','Argentina'),
	(4,'Cuaderno 500 hojas',14,'Escolar','Colombia'),
	(5,'Lapiceras de colores x12',20,'Escolar','Ecuador'),
	(6,'Smart TV Sony',300,'Tecnología','Argentina'),
	(7,'Almohadon violeta',21,'Hogar','Estados Unidos'),
	(8,'Pantalon de jean mujer',34,'Indumentaria','Argentina'),
	(9,'Mouse inalámbrico',15,'Tecnología','Colombia'),
	(10,'Campera de jean',42,'Indumentaria','Estados Unidos'),
	(11,'Sofa negro',430,'Hogar','Ecuador'),
	(12,'Mesa + 6 sillas',235,'Hogar','Colombia');
```

#### ejecutar script, consultas BD

```sql
$ sudo docker exec -it test-mysql bash
# mysql -u root -p
mysql> drop database amazon; # le saqué el tilde a Tecnología
mysql> source /mysql-amazon.sql;
mysql> show databases;
mysql> use amazon;
mysql> show tables;
mysql> describe producto;
mysql> select * from producto;
mysql> select nombre, precio from producto;
mysql> select nombre, precio from producto where precio < 100;
mysql> select nombre, categoria from producto where categoria = "Indumentaria";
mysql> select nombre, precio from producto where categoria = "Tecnologia" AND precio < 300;
mysql> select nombre, precio, pais_venta from producto where pais_venta = "Estados Unidos" AND precio < 300;
mysql> select nombre, categoria, pais_venta from producto where categoria = "Hogar" AND pais_venta = "Colombia";
mysql> select * from producto where categoria = "Hogar" AND pais_venta = "Argentina" AND precio < 5;
mysql> select * from producto where categoria = "Indumentaria" AND pais_venta = "Estados Unidos" AND precio < 50;
```
