@echo off
echo ==========================================
echo      UI SYSTEM - FORCE CLEAN INSTALL
echo ==========================================
echo.
echo 1. Setting up Environment...
SET "PATH=C:\Program Files\nodejs;%PATH%"

echo.
echo 2. Cleaning old installation (if any)...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo    - Old node_modules removed.
)
if exist "package-lock.json" (
    del "package-lock.json"
    echo    - Old lock file removed.
)

echo.
echo 3. Installing dependencies FRESH...
call npm install

echo.
echo 4. Verifying installation...
if exist "node_modules\.bin\vite.cmd" (
    echo [SUCCESS] Vite is installed and ready!
) else (
    echo [ERROR] Something went wrong. Vite is still missing.
)

echo.
echo ==========================================
echo      SETUP COMPLETE - PRESS ANY KEY
echo ==========================================
pause
