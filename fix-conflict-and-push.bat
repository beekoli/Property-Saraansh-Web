@echo off
echo =====================================================
echo  Resolve conflict and push videos.ts
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/4] Accepting our version of wordpress.ts...
git checkout --ours src/lib/wordpress.ts
git add src/lib/wordpress.ts

echo.
echo [2/4] Also staging videos.ts...
git add src/lib/videos.ts

echo.
echo [3/4] Committing...
git commit -m "seo: update L&T Green Reserve buying guide — optimized title, description, full content and focus keyword"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git commit failed.
    pause
    exit /b 1
)

echo.
echo [4/4] Pushing to GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: git push failed.
    pause
    exit /b 1
)

echo.
echo =====================================================
echo  Done! Vercel deploying in ~1-2 minutes.
echo  https://propertysaraansh.com/our-videos/lt-green-reserve-sector-128-buying-guide
echo =====================================================
pause
