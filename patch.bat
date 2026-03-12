@echo off
:: NexLed — Patch Runner
:: Run from the ROOT of the NexLed project.
:: Edit patch.py to add new patches, then re-run this.

echo.
python --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Python not found. Install Python 3.7+ and try again.
    pause
    exit /b 1
)

python patch.py
if errorlevel 1 (
    echo.
    echo  ONE OR MORE PATCHES FAILED. See error above.
    pause
    exit /b 1
)

echo.
pause
