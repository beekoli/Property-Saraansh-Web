@echo off
echo =====================================================
echo  Push existing commit to GitHub (skip commit step)
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/3] Fetching remote...
git fetch origin
echo.

echo [2/3] Merging remote changes...
git merge origin/main -X ours --no-edit
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: merge failed.
    pause
    exit /b 1
)
echo.

echo [3/3] Pushing to GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: push failed.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  Done! Vercel deploying in ~1-2 minutes.
echo  New URL: https://propertysaraansh.com/our-videos/eldeco-7-peaks-residences-greater-noida-review
echo =====================================================
pause
