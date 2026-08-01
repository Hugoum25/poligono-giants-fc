@echo off
title Servidor Web - Poligono Giants FC7
echo ==========================================
echo    POLIGONO GIANTS FC7 - SERVIDOR WEB
echo ==========================================
echo.
echo Iniciando servidor en http://127.0.0.1:8080 ...
echo Abriendo navegador automaticamente...
echo.

cd /d "%~dp0"

:: Abrir el navegador en 2 segundos
start "" "http://127.0.0.1:8080"

:: Ejecutar servidor Python en 127.0.0.1 puerto 8080
python -m http.server 8080 --bind 127.0.0.1

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Intentando con el comando 'py'...
    py -m http.server 8080 --bind 127.0.0.1
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudo iniciar el servidor con Python.
    echo Por favor asegurese de tener Python instalado.
)

pause
