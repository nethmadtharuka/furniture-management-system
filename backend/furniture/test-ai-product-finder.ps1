$body = @{
    query = "I need a comfortable bed under 100000 LKR"
} | ConvertTo-Json

Write-Host "Testing AI Product Finder..."
Write-Host "Query: I need a comfortable bed under 100000 LKR"
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/product-finder" `
        -Method Post `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✅ SUCCESS!"
    Write-Host ""
    Write-Host "Response:"
    $response | ConvertTo-Json -Depth 10
    
} catch {
    Write-Host "❌ ERROR!"
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Message: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
