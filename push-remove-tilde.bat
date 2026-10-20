@echo off
echo =====================================================
echo  Remove tilde (~) from site content -> push main
echo =====================================================
echo.
cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/4] Removing lock files...
del /f ".git\index.lock" 2>nul
git rebase --abort 2>nul
git merge --abort 2>nul
echo.

echo [2/4] On main + up to date...
git checkout main
git pull origin main --no-edit
if %ERRORLEVEL% NEQ 0 ( echo ERROR: pull failed. & pause & exit /b 1 )
echo.

echo [3/4] Staging the 3 content files...
git add src/lib/videos.ts src/lib/blogFaqs.ts src/data/blogs.json
git diff --cached --name-only
echo.
echo Remaining tildes in these files (should be 0 0 0):
powershell -Command "(Select-String -Path 'src\lib\videos.ts' -Pattern '~' -AllMatches).Matches.Count"
powershell -Command "(Select-String -Path 'src\lib\blogFaqs.ts' -Pattern '~' -AllMatches).Matches.Count"
powershell -Command "(Select-String -Path 'src\data\blogs.json' -Pattern '~' -AllMatches).Matches.Count"
echo.

echo [4/4] Commit + push...
git commit -m "content: remove tilde (~) approximation signs from video + blog data"
if %ERRORLEVEL% NEQ 0 ( echo No changes or commit failed. & git status & pause & exit /b 1 )
git push origin main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: push failed. & git status & pause & exit /b 1 )

echo.
echo =====================================================
echo  Done! Vercel rebuilds in ~1-2 min.
echo =====================================================
pause
