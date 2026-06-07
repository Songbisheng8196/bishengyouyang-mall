# Test full backend server
$ErrorActionPreference = 'Stop'
Set-Location D:\bisheng-youyang\backend

# Start the main server
$nodeProc = Start-Process -FilePath "node" -ArgumentList "src/app.js" -PassThru -WindowStyle Hidden

# Wait for server to start
Start-Sleep -Seconds 4

# Test APIs
$tests = @(
    @{Name="Health"; Url="http://localhost:3000/health"},
    @{Name="API Info"; Url="http://localhost:3000/api"},
    @{Name="Categories"; Url="http://localhost:3000/api/categories"},
    @{Name="Products"; Url="http://localhost:3000/api/products"}
)

foreach ($test in $tests) {
    try {
        $response = Invoke-WebRequest -Uri $test.Url -UseBasicParsing
        Write-Host "[$($test.Name)] Status: $($response.StatusCode)"
    } catch {
        Write-Host "[$($test.Name)] Error: $($_.Exception.Message)"
    }
}

# Cleanup
if ($nodeProc -and -not $nodeProc.HasExited) {
    Stop-Process -Id $nodeProc.Id -Force -ErrorAction SilentlyContinue
}

Write-Host "Test completed."