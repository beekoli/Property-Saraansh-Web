@echo off
echo =====================================================
echo  NUCLEAR RESET -- Reset to remote, cherry-pick ours
echo =====================================================
echo.

cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/6] Aborting any stuck operation...
git rebase --abort 2>nul
git merge --abort 2>nul
echo.

echo [2/6] Removing ALL git lock/state files...
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\MERGE_HEAD" del /f ".git\MERGE_HEAD"
if exist ".git\MERGE_MSG" del /f ".git\MERGE_MSG"
if exist ".git\CHERRY_PICK_HEAD" del /f ".git\CHERRY_PICK_HEAD"
if exist ".git\rebase-merge" rmdir /s /q ".git\rebase-merge"
if exist ".git\rebase-apply" rmdir /s /q ".git\rebase-apply"
echo Done.
echo.

echo [3/6] Force-checkout main and hard reset...
git checkout -f main
git reset --hard HEAD
echo.

echo [4/6] Fetching remote then resetting to origin/main...
git fetch origin
git reset --hard origin/main
echo.

echo [5/6] Cherry-picking our videos.ts commit (b855d01)...
git cherry-pick b855d01
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: cherry-pick failed.
    pause
    exit /b 1
)
echo.

echo [6/6] Pushing to GitHub...
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
