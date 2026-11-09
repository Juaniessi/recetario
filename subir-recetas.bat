@echo off
rem Doble click: revisa las recetas y, si estan bien, las sube al sitio.
rem La logica esta en scripts\subir.mjs.
chcp 65001 >nul
cd /d "%~dp0"
node scripts\subir.mjs %*
echo.
pause
