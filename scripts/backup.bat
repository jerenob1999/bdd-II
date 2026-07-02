@echo off
title Backup TPI Base de Datos II

echo ==========================================
echo  Backup MongoDB Atlas - AulaVirtualDB
echo ==========================================

REM Obtener fecha actual en formato YYYY-MM-DD
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set FECHA=%%i

REM Crear rutas relativas
set CARPETA_RAIZ=resguardos_tpi
set CARPETA_DESTINO=%CARPETA_RAIZ%\%FECHA%

REM Crear carpetas si no existen
if not exist "%CARPETA_RAIZ%" mkdir "%CARPETA_RAIZ%"
if not exist "%CARPETA_DESTINO%" mkdir "%CARPETA_DESTINO%"

echo.
echo Carpeta de destino: %CARPETA_DESTINO%
echo.

REM Ejecutar mongodump contra MongoDB Atlas
mongodump --uri="mongodb+srv://USUARIO:CONTRASENIA@cluster0.xxxxx.mongodb.net/AulaVirtualDB" --out="%CARPETA_DESTINO%"

echo.
echo ==========================================
echo  Backup finalizado
echo ==========================================
echo El respaldo fue guardado en: %CARPETA_DESTINO%
echo.

pause
