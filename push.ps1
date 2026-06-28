$repoUrl = Read-Host "Please paste your empty GitHub repository URL (e.g. https://github.com/username/QuickBite.git)"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "URL cannot be empty. Exiting..." -ForegroundColor Red
    exit
}

Write-Host "Configuring remote..." -ForegroundColor Yellow
git remote add origin $repoUrl
git branch -M main

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push. Make sure the URL is correct and you are logged into Git." -ForegroundColor Red
}
