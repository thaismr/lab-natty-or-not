@echo off
REM Deploy clinic demo infrastructure using Bicep
REM Usage: deploy.bat [resource-group-name] [location] [sql-password]

SETLOCAL

SET RG_NAME=%1
SET LOCATION=%2
SET SQL_PASSWORD=%3

IF "%RG_NAME%"=="" SET RG_NAME=clinic-demo-rg
IF "%LOCATION%"=="" SET LOCATION=eastus
IF "%SQL_PASSWORD%"=="" (
    echo Error: SQL Admin password is required
    echo Usage: deploy.bat [resource-group-name] [location] [sql-password]
    exit /b 1
)

echo.
echo ========================================
echo Deploying Clinic Demo Infrastructure
echo ========================================
echo Resource Group: %RG_NAME%
echo Location: %LOCATION%
echo.

REM Check if Azure CLI is installed
az --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Azure CLI is not installed
    echo Install it from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
    exit /b 1
)

REM Login to Azure
echo Step 1: Logging in to Azure...
az login --output none

REM Create resource group
echo Step 2: Creating resource group '%RG_NAME%' in '%LOCATION%'...
az group create --name %RG_NAME% --location %LOCATION% --output none

REM Deploy Bicep template
echo Step 3: Deploying Bicep template...
az deployment group create ^
    --resource-group %RG_NAME% ^
    --template-file main.bicep ^
    --parameters ^
        resourceGroupName=%RG_NAME% ^
        location=%LOCATION% ^
        sqlAdminPassword=%SQL_PASSWORD% ^
    --output table

IF %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Deployment completed successfully!
    echo ========================================
) ELSE (
    echo.
    echo ========================================
    echo Deployment failed!
    echo ========================================
    exit /b 1
)

ENDLOCAL
