# Run from repo root:  powershell -ExecutionPolicy Bypass -File scripts\setup-git.ps1
# Or: cd to project folder, then .\scripts\setup-git.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host ""
  Write-Host "[X] Git not found in PATH." -ForegroundColor Red
  Write-Host "    Install: https://git-scm.com/download/win" -ForegroundColor Yellow
  Write-Host "    Then reopen terminal and run this script again." -ForegroundColor Yellow
  Write-Host ""
  exit 1
}

if (-not (Test-Path ".git")) {
  git init
  Write-Host "[OK] git init" -ForegroundColor Green
} else {
  Write-Host "[i] .git already exists, skipped init" -ForegroundColor Cyan
}

git add .
$status = git status --porcelain
if (-not $status) {
  Write-Host "[i] Nothing to commit (working tree clean)" -ForegroundColor Cyan
} else {
  git commit -m "Initial commit: Wuhan performance meet MVP (Expo)"
  if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "If commit failed, set your identity once:" -ForegroundColor Yellow
    Write-Host '  git config --global user.email "you@example.com"' -ForegroundColor Gray
    Write-Host '  git config --global user.name "Your Name"' -ForegroundColor Gray
    Write-Host "  Then run this script again." -ForegroundColor Yellow
    Write-Host ""
    exit 1
  }
  Write-Host "[OK] first commit created" -ForegroundColor Green
}

git branch -M main 2>$null

Write-Host ""
Write-Host "Next steps (create empty repo on GitHub / Gitee first):" -ForegroundColor Cyan
Write-Host '  git remote add origin https://github.com/<user>/<repo>.git' -ForegroundColor White
Write-Host "  git push -u origin main" -ForegroundColor White
Write-Host ""
