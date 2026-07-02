# Conclusión sobre la comunicación Cliente-Servidor

Durante el desarrollo de la Parte 2 del Trabajo Práctico Integrador se implementó un backend utilizando Node.js, Express, TypeScript y Mongoose, conectado a la base de datos `AulaVirtualDB` alojada en MongoDB Atlas.

Uno de los principales desafíos fue comprender el flujo de comunicación entre el cliente, el servidor y la base de datos. En este caso, las pruebas se realizaron mediante Postman, que permitió simular las solicitudes del cliente hacia la API.

El flujo implementado puede resumirse de la siguiente manera:

Postman → Backend Express → MongoDB Atlas

A través de este flujo se probaron operaciones CRUD sobre las colecciones `usuarios`, `cursos`, `inscripciones` y `entregas`. Además, se respetó el criterio de baja lógica, evitando la eliminación física de documentos y actualizando el campo activo a false.

También se incorporaron validaciones en los métodos POST para evitar la creación de documentos incompletos o inconsistentes. Esto permitió mejorar la calidad de los datos enviados al servidor antes de ser almacenados en MongoDB.

En conclusión, esta etapa permitió integrar los conceptos de API REST, persistencia en una base de datos NoSQL cloud y administración básica de datos mediante backups. La experiencia ayudó a comprender cómo una aplicación backend puede recibir solicitudes, procesarlas, validar la información y comunicarse con una base de datos remota.
