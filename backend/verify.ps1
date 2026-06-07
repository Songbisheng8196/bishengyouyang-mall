# Quick verification - test all main APIs
$ErrorActionPreference = 'Continue'
Set-Location D:\bisheng-youyang\backend

# Start server with more wait time
$nodeProc = Start-Process -FilePath "node" -ArgumentList "src\app.js" -PassThru -WindowStyle Hidden -RedirectStandardOutput "$env:TEMP\node_out.log"

# Wait longer for startup
Start-Sleep -Seconds 6

# Check if process is still running
if ($nodeProc.HasExited) {
    Write-Host "ERROR: Server exited with code $($nodeProc.ExitCode)"
    Get-Content "$env:TEMP\node_out.log" | Select-Object -First 20
    exit 1
}

Write-Host "Server started with PID: $($nodeProc.Id)"

# Test APIs
$tests = @(
    @{Name="Health"; Url="http://localhost:3000/health"},
    @{Name="API"; Url="http://localhost:3000/api"},
    @{Name="Categories"; Url="http://localhost:3000/api/categories"},
    @{Name="Products"; Url="http://localhost:3000/api/products"}
)

$allPassed = $true
foreach ($test in $tests) {
    try {
        $response = Invoke-WebRequest -Uri $test.Url -UseBasicParsing -TimeoutSec 5
        Write-Host "[PASS] $($test.Name): Status $($response.StatusCode)"
    } catch {
        Write-Host "[FAIL] $($test.Name): $($_.Exception.Message)"
        $allPassed = $false
    }
}

# Cleanup
Stop-Process -Id $nodeProc.Id -Force -ErrorAction SilentlyContinue

if ($allPassed) {
    Write-Host ""
    Write-Host "All API tests passed!"
    exit 0
} else {
    Write-Host ""
    Write-Host "Some tests failed. Check output above."
    exit 1
}