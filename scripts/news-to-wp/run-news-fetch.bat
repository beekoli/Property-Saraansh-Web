@echo off
setlocal
cd /d "%~dp0"
echo ============================================================
echo   Property Saraansh - Fetch news candidates (Google News)
echo ============================================================
echo.
if not exist node_modules (
  echo Installing dependencies the first time...
  call npm install
  echo.
)
echo Fetching candidates from your search terms (search-terms.txt)...
echo.
node fetch-news.js %*
echo.
echo ------------------------------------------------------------
echo Done. Open candidates.md to pick the stories you want.
pause
