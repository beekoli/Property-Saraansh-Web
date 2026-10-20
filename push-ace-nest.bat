@echo off
echo =====================================================
echo  ACE Nest -- commit videos.ts and push
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/5] Cleaning lock files...
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\MERGE_HEAD" del /f ".git\MERGE_HEAD"
if exist ".git\rebase-merge" rmdir /s /q ".git\rebase-merge"
if exist ".git\rebase-apply" rmdir /s /q ".git\rebase-apply"
echo.

echo [2/5] Staging videos.ts...
git add src/lib/videos.ts
echo.

echo [3/5] Committing...
git commit -m "seo: ACE Nest Studio Yamuna Expressway -- update slug, title, description, content, focusKeyword"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: commit failed.
    pause
    exit /b 1
)
echo.

echo [4/5] Fetching and merging remote...
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
echo  Done! Vercel deploying in ~1-2 minutes.
echo  https://propertysaraansh.com/our-videos/ace-nest-studio-yamuna-expressway-review
echo =====================================================
pause
