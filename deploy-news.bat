@echo off
setlocal
cd /d "%~dp0"
echo =====================================================
echo   Property Saraansh - Deploy /news section
echo =====================================================
echo.
if exist ".git\index.lock" del /f ".git\index.lock"

echo [1/3] Staging only the news-section files...
git add src/lib/wordpress.ts src/components/BlogCard.tsx src/components/Navbar.tsx src/app/sitemap.ts src/app/news src/data/news.json

echo.
echo [2/3] Committing...
git commit -m "Add daily Real Estate News section (/news): separate from blog, dedicated nav item, no video, SEO schema"

echo.
echo [3/3] Pushing to GitHub main (Vercel auto-deploys)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: push failed. Check your internet / GitHub login and try again.
    pause
    exit /b 1
)

echo.
echo Done. Vercel will build and go live in about 1-2 minutes.
echo Then open: https://www.propertysaraansh.com/news
pause
