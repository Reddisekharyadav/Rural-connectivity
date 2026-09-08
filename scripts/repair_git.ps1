# PowerShell helper to repair corrupted / truncated git index on Windows
Write-Host '[RuralConnect] Checking Git repository index health...' -ForegroundColor Cyan

if (Test-Path .git/index) {
    $index = Get-Item .git/index
    if ($index.Length -eq 0) {
        Write-Host '[WARNING] .git/index was 0 bytes (truncated). Rebuilding index from HEAD...' -ForegroundColor Yellow
        Remove-Item .git/index -Force
        git reset
    }
}

# Ensure safe Windows settings to prevent future race condition truncation
git config core.untrackedcache false
git config core.preloadindex false

$statusOutput = git status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host '[WARNING] Git reported error. Forcing index recreation...' -ForegroundColor Yellow
    if (Test-Path .git/index) { Remove-Item .git/index -Force }
    git reset
    git status
} else {
    Write-Host '[PASS] Git index is healthy and clean!' -ForegroundColor Green
    git status -s
}
