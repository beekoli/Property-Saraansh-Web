@echo off
echo =====================================================
echo  Top 3 Self-Use -- abort rebase, merge, push
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/5] Aborting stuck rebase...
git rebase --abort
echo Rebase aborted (or was not in progress).
echo.

echo [2/5] Removing lock files...
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\rebase-merge" rmdir /s /q ".git\rebase-merge"
if exist ".git\rebase-apply" rmdir /s /q ".git\rebase-apply"
echo.

echo [3/5] Fetching remote...
git fetch origin
echo.

echo [4/5] Merging origin/main (accepting theirs for any conflicts)...
git merge origin/main -X theirs --no-edit
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
echo  https://propertysaraansh.com/our-videos/top-3-self-use-projects-noida-expressway
echo =====================================================
pause
