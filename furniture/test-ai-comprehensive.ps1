# Test 1: Search for beds
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test 1: Searching for beds under 100000 LKR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$body1 = @{
    query = "I need a bed under 100000 LKR"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/product-finder" `
        -Method Post `
        -Body $body1 `
        -ContentType "application/json"
    
    Write-Host "✅ Found $($response1.totalMatches) products" -ForegroundColor Green
    Write-Host "Intent Category: $($response1.intent.category)" -ForegroundColor Yellow
    
    foreach ($match in $response1.matches) {
        Write-Host "`n  Product: $($match.product.name)" -ForegroundColor White
        Write-Host "  Price: LKR $($match.product.price)" -ForegroundColor White
        Write-Host "  Category: $($match.product.category)" -ForegroundColor White
        Write-Host "  Match Score: $([math]::Round($match.matchScore, 2))" -ForegroundColor White
        Write-Host "  Explanation: $($match.explanation)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Test 2: Search for office chairs
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test 2: Searching for office chairs" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$body2 = @{
    query = "office chair"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/product-finder" `
        -Method Post `
        -Body $body2 `
        -ContentType "application/json"
    
    Write-Host "✅ Found $($response2.totalMatches) products" -ForegroundColor Green
    Write-Host "Intent Category: $($response2.intent.category)" -ForegroundColor Yellow
    
    foreach ($match in $response2.matches) {
        Write-Host "`n  Product: $($match.product.name)" -ForegroundColor White
        Write-Host "  Price: LKR $($match.product.price)" -ForegroundColor White
        Write-Host "  Category: $($match.product.category)" -ForegroundColor White
        Write-Host "  Stock: $($match.product.stockQuantity) units" -ForegroundColor White
        Write-Host "  Match Score: $([math]::Round($match.matchScore, 2))" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n"

# Test 3: Search for sofas
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test 3: Searching for sofas" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$body3 = @{
    query = "modern sofa for living room"
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:8080/api/ai/product-finder" `
        -Method Post `
        -Body $body3 `
        -ContentType "application/json"
    
    Write-Host "✅ Found $($response3.totalMatches) products" -ForegroundColor Green
    Write-Host "Intent Category: $($response3.intent.category)" -ForegroundColor Yellow
    
    foreach ($match in $response3.matches) {
        Write-Host "`n  Product: $($match.product.name)" -ForegroundColor White
        Write-Host "  Price: LKR $($match.product.price)" -ForegroundColor White
        Write-Host "  Description: $($match.product.description)" -ForegroundColor Gray
        Write-Host "  Match Score: $([math]::Round($match.matchScore, 2))" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
