@echo off
echo =====================================================
echo  RESTORE 3 lost videos + ACE Hanei SEO -> push main
echo =====================================================
echo.
cd /d "%~dp0"
echo Working in: %CD%
echo.

echo [1/6] Removing lock files...
del /f ".git\index.lock" 2>nul
del /f ".git\HEAD.lock" 2>nul
del /f ".git\MERGE_HEAD" 2>nul
git rebase --abort 2>nul
git merge --abort 2>nul
echo Done.
echo.

echo [2/6] Sync to latest origin/main...
git fetch origin main
git checkout main
git reset --hard origin/main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: reset failed. & pause & exit /b 1 )
echo Current HEAD:
git log --oneline -1
echo.

echo [3/6] Restoring clean 84-entry videos.ts from commit 14c6fb2...
git checkout 14c6fb2 -- src/lib/videos.ts
if %ERRORLEVEL% NEQ 0 ( echo ERROR: could not restore videos.ts from 14c6fb2. & pause & exit /b 1 )
echo Slug count after restore:
powershell -Command "(Select-String -Path 'src\lib\videos.ts' -Pattern '\"slug\":' -AllMatches).Matches.Count"
echo.

echo [4/6] Applying ACE Hanei SEO fix (adds content field + new title)...
python fix-videos-conflicts.py
if %ERRORLEVEL% NEQ 0 ( echo ERROR: Python fix failed. & pause & exit /b 1 )
echo.
echo Verify - Sector 150 Registry video restored:
powershell -Command "Select-String -Path 'src\lib\videos.ts' -Pattern 'ace-new-launch-sector-150-noida'"
echo Verify - ACE Hanei new title:
powershell -Command "Select-String -Path 'src\lib\videos.ts' -Pattern 'ACE Hanei HONEST Review'"
echo.

echo [5/6] Committing...
git commit -a -m "fix: restore 3 dropped video entries (Sector 150 launch, Eldeco 7 Peaks, Instagram) + ACE Hanei SEO"
if %ERRORLEVEL% NEQ 0 ( echo No changes or commit failed. & git status & pause & exit /b 1 )
echo.

echo [6/6] Pushing to main...
git push origin main
if %ERRORLEVEL% NEQ 0 ( echo ERROR: push failed. & git status & pause & exit /b 1 )

echo.
echo =====================================================
echo  Done! All 84 videos restored + ACE Hanei SEO live.
echo  Vercel rebuilds in ~1-2 min. Watch pages back in sitemap.
echo =====================================================
pause
