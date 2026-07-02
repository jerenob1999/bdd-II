# Análisis RTO/RPO

Como parte del mecanismo de resguardo de la información, se desarrolló un script ejecutable para Windows llamado `backup.bat`. Este script utiliza la herramienta nativa `mongodump` para conectarse remotamente al clúster de MongoDB Atlas y generar una copia física de la base de datos `AulaVirtualDB`.

El script crea una carpeta llamada `resguardos_tpi` y, dentro de ella, una subcarpeta con la fecha actual de ejecución. Allí se almacena el respaldo generado por `mongodump`, incluyendo los archivos `.bson` y `.metadata.json` correspondientes a las colecciones de la base de datos.

## RPO

El RPO, o Recovery Point Objective, indica el punto máximo de pérdida de datos aceptable ante una falla.

En este proyecto, si el script de backup se ejecutara una vez por día, el RPO estimado sería de 24 horas. Esto significa que, ante una falla, se podrían perder como máximo los cambios realizados desde el último respaldo hasta el momento del incidente.

## RTO

El RTO, o Recovery Time Objective, indica el tiempo máximo estimado para recuperar el servicio o restaurar la información.

En este caso, al tratarse de una base de datos pequeña y de uso académico, el tiempo de recuperación sería reducido. La restauración consistiría en ubicar la carpeta del respaldo correspondiente, ejecutar la herramienta `mongorestore` y verificar que las colecciones hayan sido recuperadas correctamente.

Para este proyecto, se estima un RTO aproximado de entre 10 y 20 minutos, considerando el tiempo necesario para identificar el respaldo, ejecutar la restauración y comprobar el estado de la base de datos.

## Conclusión

La estrategia de backup propuesta permite contar con una copia física de la información almacenada en MongoDB Atlas. Esto reduce el riesgo de pérdida total de datos ante errores, fallas o modificaciones accidentales, y permite comprender la importancia de los mecanismos de resguardo dentro de la administración de bases de datos.
