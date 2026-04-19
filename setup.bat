@echo off
echo ============================================
echo   SmartHire Setup Script
echo ============================================

echo.
echo [1/2] Installing root dependencies...
call npm install

echo.
echo [2/2] Setup complete!
echo.
echo ============================================
echo   NEXT STEPS:
echo ============================================
echo.
echo 1. Configure .env in the project root
echo    Include DATABASE_URL, JWT_SECRET, FRONTEND_URL, and JUDGE0_URL
echo.
echo 2. For local PostgreSQL, create the database:
echo    psql -U postgres -c "CREATE DATABASE smarthire;"
echo.
echo 3. Run the schema:
echo    psql -U postgres -d smarthire -f db/schema.sql
echo.
echo 4. Seed the coding practice catalog:
echo    npm run seed:users
echo    npm run seed:coding
echo.
echo 5. Start the full app:
echo    npm run dev
echo.
echo 6. Open http://localhost:5173
echo.
echo Admin Login: admin@smarthire.com / admin123
echo ============================================
