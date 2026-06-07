# Test script for backend server
$ErrorActionPreference = 'Stop'
Set-Location D:\bisheng-youyang\backend

# Start the server
$nodeProc = Start-Process -FilePath "node" -ArgumentList "test-server.js" -PassThru -WindowStyle Hidden

# Wait for server to start
Start-Sleep -Seconds 3

# Test the API
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/categories" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $_"
} finally {
    # Cleanup
    if ($nodeProc -and -not $nodeProc.HasExited) {
        Stop-Process -Id $nodeProc.Id -Force -ErrorAction SilentlyContinue
    }
}