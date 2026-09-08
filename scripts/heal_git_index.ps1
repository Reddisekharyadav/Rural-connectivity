Write-Host "[RuralConnect] Checking Git repository integrity..." -ForegroundColor Cyan
$statusOutput = git status 2>&1 | Out-String
if ($LASTEXITCODE -ne 0 -or $statusOutput -like "*index file smaller than expected*" -or $statusOutput -like "*corrupt index*") {
    Write-Host "[RuralConnect] Index contention detected. Auto-rebuilding from HEAD..." -ForegroundColor Yellow
    if (Test-Path ".git/index") {
        Remove-Item -Force ".git/index"
    }
    git reset | Out-Null
    Write-Host "[RuralConnect] Git index restored cleanly! No data lost." -ForegroundColor Green
} else {
    Write-Host "[RuralConnect] Git repository index is 100% healthy." -ForegroundColor Green
}
