@echo off
echo ?? Configuration automatique - Plateforme Reperage Lieux
echo =======================================================

REM Vérifier Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ? Node.js non installé. Téléchargez-le sur https://nodejs.org
    pause
    exit /b 1
)

echo ? Node.js détecté

REM Configuration Backend
echo.
echo ?? Configuration Backend...
cd backend

echo ?? Installation des dépendances...
call npm install

echo ?? Configuration environnement...
if not exist .env (
    copy .env.example .env
    echo ?? Fichier .env créé - N'oubliez pas de le modifier !
)

echo.
echo ??? IMPORTANT - Configuration Base de Données
echo Avant de continuer, assurez-vous que :
echo 1. PostgreSQL est installé et démarré
echo 2. Créez une base 'reperage_lieux' 
echo 3. Modifiez le fichier backend\.env avec vos paramètres
echo.
set /p continue="Continuer avec la configuration DB ? (o/N): "
if /i "%continue%"=="o" (
    echo ?? Application des migrations...
    call npx prisma migrate dev --name init
    
    echo ?? Création des données de test...
    call npx prisma db seed
    
    echo ? Base de données configurée !
) else (
    echo ?? Configuration DB reportée
    echo Lancez manuellement : npx prisma migrate dev --name init
)

cd ..

REM Configuration Frontend
echo.
echo ?? Configuration Frontend...
cd frontend

echo ?? Installation React...
if not exist package.json (
    call npx create-react-app . --template typescript
)

call npm install axios react-router-dom leaflet react-leaflet

echo ?? Configuration frontend...
if not exist .env (
    echo REACT_APP_API_URL=http://localhost:3001/api > .env
)

cd ..

echo.
echo ?? Configuration terminée !
echo =========================
echo.
echo ?? Pour démarrer l'application :
echo 1. Terminal 1: cd backend ^&^& npm run dev
echo 2. Terminal 2: cd frontend ^&^& npm start
echo.
echo ?? URLs :
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:3001/api/health
echo.
echo ?? Comptes de test :
echo - user@test.com / password123
echo - admin@test.com / password123
echo.
pause