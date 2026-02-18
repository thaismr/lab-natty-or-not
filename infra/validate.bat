@echo off
REM Validate Bicep template syntax
REM Usage: validate.bat

echo.
echo ========================================
echo Validating Bicep Template
echo ========================================
echo.

REM Check if Bicep CLI is installed
az bicep version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Installing Bicep CLI...
    az bicep install
)

REM Validate Bicep file
echo Validating main.bicep...
az bicep build --file main.bicep --stdout > main.json

IF %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Bicep file is valid!
    echo Generated: main.json
    echo ========================================
) ELSE (
    echo.
    echo ========================================
    echo Validation failed!
    echo ========================================
    exit /b 1
)
