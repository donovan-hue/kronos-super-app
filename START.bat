@echo off
REM Deprecated launcher retained only as a compatibility stub.
REM Use the unified workflow instead:
REM   npm run dev

echo This launcher is no longer used.
echo Run: npm run dev
exit /b 0
    echo ⚠️  node_modules no encontrado en /server
    echo    Instalando...
    cd server
    call npm install
    cd ..
    if errorlevel 1 (
        echo ❌ Error al instalar server dependencies
        pause
        exit /b 1
    )
)
echo ✅ Server dependencies OK

if not exist client\node_modules (
    echo ⚠️  node_modules no encontrado en /client
    echo    Instalando...
    cd client
    call npm install
    cd ..
    if errorlevel 1 (
        echo ❌ Error al instalar client dependencies
        pause
        exit /b 1
    )
)
echo ✅ Client dependencies OK

REM Todo OK - mostrar instrucciones finales
echo.
echo ╔═════════════════════════════════════════════════════════════════╗
echo ║            ✅ VERIFICACIÓN COMPLETADA - TODO OK                ║
echo ╚═════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 PARA EJECUTAR EL PROYECTO:
echo.
echo OPCIÓN 1 - Dos terminales (RECOMENDADO):
echo   Terminal 1: cd server ^&^& node server.js
echo   Terminal 2: cd client ^&^ npm start
echo.
echo OPCIÓN 2 - Ejecutar ambos (experimental):
echo   npm run dev
echo.
echo 🌐 Una vez iniciado, abre: http://localhost:3000
echo.
echo 📝 NOTAS:
echo   - Backend corre en: http://localhost:5000
echo   - Frontend corre en: http://localhost:3000
echo   - API Health check: http://localhost:5000/api/health
echo.
pause
