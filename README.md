<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.imgur.com/s6gic83.png" alt="Project logo"></a>
</p>
<h3 align="center">Events Node.js Api Rest</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/matiasdsanchezr/EventsApiRest.svg)](https://github.com/matiasdsanchezr/EventsApiRest/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/matiasdsanchezr/EventsApiRest.svg)](https://github.com/matiasdsanchezr/EventsApiRest/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

</div>

---

<p align="center"> Proyecto de aprendizaje.
    <br> 
</p>

## 📝 Tabla de contenidos

- [📝 Tabla de contenidos](#-tabla-de-contenidos)
- [🧐 Problema Planteado <a name = "problem_statement"></a>](#-problema-planteado-)
- [💡 Idea / Solución <a name = "idea"></a>](#-idea--solución-)
- [⛓️ Dependencias / Limitaciones <a name = "limitations"></a>](#️-dependencias--limitaciones-)
- [🏁 Empezando <a name = "getting_started"></a>](#-empezando-)
  - [Pre-requisitos](#pre-requisitos)
  - [Instalando](#instalando)
- [🎈 Usos <a name="usage"></a>](#-usos-)
  - [Usuarios:](#usuarios)
    - [POST - /users](#post---users)
    - [POST - /users/login](#post---userslogin)
  - [Eventos:](#eventos)
    - [GET - /events](#get---events)
    - [GET - /events/:id](#get---eventsid)
    - [GET - /events/page/:page](#get---eventspagepage)
    - [GET - /events/share/:id](#get---eventsshareid)
    - [POST - /events](#post---events)
    - [PUT - /events](#put---events)
    - [DELETE - /events/](#delete---events)
- [⛏️ Desarrollado con <a name = "tech_stack"></a>](#️-desarrollado-con-)
- [✍️ Autor <a name = "authors"></a>](#️-autor-)

## 🧐 Problema Planteado <a name = "problem_statement"></a>

Se necesita desarrollar una api rest que liste y permita crear eventos. El sistema final será una cartelera de eventos muy simple.

## 💡 Idea / Solución <a name = "idea"></a>

Esta es una sencilla aplicación API Rest desarrollada con Node.js, Express y mongoose que cumple con los requerimientos básicos planteados en la prueba de [Ingenious Softworks](https://github.com/ingenious-agency/backend-test/tree/master/instructions#requerimientos-no-funcionales) 

Esta aplicación se encuentra subida y en funcionamiento en un servidor de Heroku:
https://events-api-rest.herokuapp.com/


## ⛓️ Dependencias / Limitaciones <a name = "limitations"></a>

Debido al tiempo limitado que se empleó para desarrollar esta aplicación se dió prioridad a las funciones esenciales que permiten el correcto funcionamiento del sistema de eventos y se dejaron de lado algunos detalles importantes en el sistema de usuarios:

- Se necesita agregar funciones para modificar los usuarios registrados en la base de datos
- Es necesario agregar métodos para verificar los correos electrónicos y los usuarios que se registran para prevenir ataques, registros masivos, etc. 
- Al compartir un evento mediante twitter se necesita implementar una opción para seleccionar una fecha de asistencia

## 🏁 Empezando <a name = "getting_started"></a>

Estas instrucciones le proporcionarán una copia del proyecto en funcionamiento en su máquina local para su desarrollo y fines de prueba. Consulte [implementación](#deployment) para obtener notas sobre cómo implementar el proyecto en un sistema.

### Pre-requisitos

Qué necesitas para instalar y ejecutar esta aplicación.

```
Node.js
NPM - Node Package Manager
MongoDB
```

### Instalando

Para empezar a usar esta aplicación se deberá:

```
Clonar el repositorio
```

```
Instalar dependencias de Node mediante el comando: "npm install"
```
```
Iniciar la aplicación con el comando "npm start"
```
Para realizar las pruebas de integración:
```
Iniciar los tests mediante el comando "npm test"
```
## 🎈 Usos <a name="usage"></a>

A continuación se lista las rutas que posee la API. Todas las rutas devuelven un json con la información solicitada, caso contrario se devuelve un arreglo "errors" con los errores registrados.

### Usuarios:

#### POST - /users
**Registrar un nuevo usuario**

Se requiere pasar los parámetros:
```
"email" - Correo electrónico
"firstName" - Nombre
"lastName" - Apellido
"password" - Contraseña con al menos una letra mayúscula, minúscula y un numero
```
Se devuelve "user" con la información del usuario registrado y el id asignado por la base de datos.

#### POST - /users/login
**Ingresar con un usuario**

Se require pasar los parámetros:
```
"email" - Correo electrónico
"password" - Contraseña con al menos una letra mayúscula, minúscula y un numero
```
Si las credenciales del usuario son validas se retornara "user" con los datos del usuario y un "token".

### Eventos:

#### GET - /events
**Obtener eventos y destacados del dia**

Se devuelve:
```
"todayEvents" - Arreglo de eventos con información de los eventos con fechas en el día actual
"todayHighlights" - Arreglo de eventos con información de los eventos destacados del dia actual
```

#### GET - /events/:id
**Obtener información de un evento mediante id**

Se requiere pasar por parámetro:
```
"id" - ID del evento del cual se requiere los detalles
```
Se devuelve:
```
"event" - Objeto con la toda información del evento
```

#### GET - /events/page/:page
**Obtener eventos paginados**

Se requiere estar logeado como un usuario y pasar mediante header un token de autenticaron con formato Bearer.
Se requiere pasar por parámetro:
```
"page" - Un entero que indica el numero de pagina que se desea obtener. La pagina 1 es la primera y contiene los 10 eventos mas próximos a la fecha actual
```
Si el numero de pagina es correcto se retorna:
```
"pageCount" - Cantidad de paginas con eventos
"events" - Arreglo con un máximo de 10 eventos con fechas cercanas a la fecha actual de manera ascendente
```

#### GET - /events/share/:id
**Obtener una url de twitter con la información del evento que se desea compartir**

Se requiere estar logeado como un usuario y pasar mediante el header un token de autenticación con formato Bearer. Ademas se requiere pasar por parámetro:
```
"id" - ID del evento que se desea compartir en Twitter
```

#### POST - /events
**Registrar un nuevo evento**

Se requiere estar logeado como un usuario y pasar mediante header un token de autenticación con formato Bearer.
Se requiere pasar mediante body los siguientes parámetros:
```
"title": El titulo del evento
"description": Descripción del evento
"dates": Arreglo de fechas con formato ISO8601
"highlight": Booleano que indica si es un evento destacado
"place": Lugar en el que se llevara a cabo el evento
"imageUrl": URL de una imagen para el evento
```
Se devuelve:
```
event - Objeto con la toda información del evento y el id asignado por la base de datos.
```

#### PUT - /events
**Modificar la información de un evento**

Se requiere estar logeado como un usuario y pasar mediante el header un token de autenticación con formato Bearer. El usuario solo puede modificar los eventos que se registraron desde su cuenta,
para ello se debe pasar todos los siguientes parámetros:
```
"id": ID del evento que se necesita modificar
"title": El titulo del evento
"description": Descripcion del evento
"dates": Arreglo de fechas con formato ISO8601
"highlight": Booleano que indica si es un evento destacado
"place": Lugar en el que se llevara a cabo el evento
"imageUrl": URL de una imagen para el evento
```
Si los parámetros son validos se retorna:
```
event - Objeto con la toda información del evento y el id asignado por la base de datos.
```

#### DELETE - /events/
**Eliminar un evento de la base de datos**

Se requiere estar logeado como un usuario y pasar mediante el header un token de autenticación con formato Bearer. El usuario solo puede eliminar los eventos que se registraron desde su cuenta,
para ello se debe pasar por parámetro:
```
"id": El ID del evento que se desea eliminar
```
Si el id del evento y las credenciales del usuario son validas se retorna:
```
event - Un objeto con la información del evento que se ha eliminado
```

## ⛏️ Desarrollado con <a name = "tech_stack"></a>

- [NodeJs](https://nodejs.org/en/) - Entorno de ejecución
- [Express](https://expressjs.com/) - Framework de servidor
- [MongoDB](https://www.mongodb.com/) - Base de datos
- [Express-Validator](https://express-validator.github.io/) . Validación y sanitización de datos

## ✍️ Autor <a name = "authors"></a>

- [@MatiasDSanchezR](https://github.com/matiasdsanchezr)
