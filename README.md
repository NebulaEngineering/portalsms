# PORTAL SMS

this library provide a method to send easily sms through Webservice Integración SMS API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Use Example

```
const smsSender = require('portalsms')

smsSender.sendOneMessage("Mensaje Test",["##########"]).then(response => {
    console.log('Response => ', response);
}).catch(error => {
    console.log('Error => ', error);
})

```
### Library Result
##### Success Result

```
[ { phoneNumber: '#########',
    sendId: '######################',
    errorCode: null,
    errorMsg: null } ]
```
##### Error Result
```
[ { phoneNumber: '##########',
    sendId: null,
    errorCode: '400',
    errorMsg: 'datos inválidos para el envío, clave o login errado.' } ]
    
[ { phoneNumber: '##########',
    sendId: null,
    errorCode: '401',
    errorMsg: 'error al insertar, por ejemplo problema de caracteres inválidos (se aceptan caracteres especiales: $%&( ), ; * - _) no se aceptan tildes ni otros caracteres.' }]
    
[ { phoneNumber: '##########',
    sendId: null,
    errorCode: '402',
    errorMsg: 'Problema interno' } ]
    
[ { phoneNumber: '##########',
    sendId: null,
    errorCode: '404',
    errorMsg: 'No hay cupo' } ]
    
[ { phoneNumber: '##########',
    sendId: null,
    errorCode: '407',
    errorMsg: 'Error interno' } ]
    
[ { phoneNumber: '##########',
    sendId: null,
    errorCode: '408',
    errorMsg: 'Ip no inscrita } ]
```
### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
npm install portalsms
```
you also have to get the needed credentials to log in on Webservice Integración SMS API, and then configure them as enviroment variable 
with the follow names:
```
PORTALSMS_WS_URL_SMS - portal sms API URL
PORTALSMS_LOGUIN - user
PORTALSMS_PASSWORD - password
```
## Built With

* [request](https://github.com/request/request) - library used to consume API

## Authors
Nebula Engineering
