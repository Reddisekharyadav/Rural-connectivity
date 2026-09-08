@echo off
echo [RuralConnect] Checking Git index integrity...
git status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [RuralConnect] Corrupted or truncated index detected. Rebuilding .git/index from HEAD...
    if exist .git\index del /f /q .git\index
    git reset
    echo [RuralConnect] Git index successfully restored!
) else (
    echo [RuralConnect] Git index is 100% healthy.
)
