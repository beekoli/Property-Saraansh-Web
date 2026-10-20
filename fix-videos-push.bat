@echo off
echo =====================================================
echo  Fix videos.ts and push to GitHub
echo  (Godrej Riverine + Eldeco 7 Peaks SEO update)
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/5] Removing git lock files...
del /f ".git\index.lock" 2>nul
del /f ".git\HEAD.lock" 2>nul
echo Done.
echo.

echo [2/5] Staging videos.ts...
git add src/lib/videos.ts
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git add failed.
    pause
    exit /b 1
)
echo.

echo [3/5] Committing...
git commit -m "fix: restore videos.ts - Godrej Riverine + Eldeco 7 Peaks watch page SEO"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: commit failed.
    pause
    exit /b 1
)
echo.

echo [4/5] Fetching and merging remote (local videos.ts wins on conflict)...
git fetch origin
git merge origin/main -X ours --no-edit
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: merge failed.
    pause
    exit /b 1
)
echo.

echo [5/5] Pushing to GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: push failed.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  Done! Vercel will rebuild in ~1-2 minutes.
echo  Check: https://propertysaraansh.com/our-videos/godrej-riverine-luxury-apartments-delhi
echo =====================================================
pause
