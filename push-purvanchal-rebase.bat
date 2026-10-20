@echo off
echo =====================================================
echo  Purvanchal Sunbliss -- pull-rebase then push
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/3] Removing git lock file (if any)...
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\rebase-merge" rmdir /s /q ".git\rebase-merge"

echo.
echo [2/3] Pull with rebase...
git pull origin main --rebase
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git pull rebase failed.
    pause
    exit /b 1
)

echo.
echo [3/3] Pushing to GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git push failed.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  Done! Vercel deploying in ~1-2 minutes.
echo  https://propertysaraansh.com/our-videos/purvanchal-sunbliss-22d-yamuna-expressway
echo =====================================================
pause
