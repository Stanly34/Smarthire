@echo off
echo ============================================
echo   SmartHire Setup Script
echo ============================================

echo.
echo [1/4] Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo [2/4] Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo [3/4] Setup complete!
echo.
echo ============================================
echo   NEXT STEPS:
echo ============================================
echo.
echo 1. Make sure PostgreSQL is running
echo 2. Create the database:
echo    psql -U postgres -c "CREATE DATABASE smarthire;"
echo.
echo 3. Run the schema:
echo    psql -U postgres -d smarthire -f backend/db/schema.sql
echo.
echo 4. Update backend/.env with your DB password
echo.
echo 5. Start the backend (in one terminal):
echo    cd backend ^&^& npm run dev
echo.
echo 6. Start the frontend (in another terminal):
echo    cd frontend ^&^& npm run dev
echo.
echo 7. Open http://localhost:5173
echo.
echo Admin Login: admin@smarthire.com / password
echo ============================================
