# HIT Student Accommodation Portal - System Verification Script (PowerShell)
# Run this script after deployment to verify everything is working correctly

Write-Host "🏫 HIT Student Accommodation Portal - System Verification" -ForegroundColor Blue
Write-Host "=========================================================" -ForegroundColor Blue
Write-Host ""

function Write-Success {
    param($Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "ℹ $Message" -ForegroundColor Cyan
}

# Function to check if containers are running
function Test-Containers {
    Write-Host "🐳 Checking Docker containers..." -ForegroundColor Blue
    
    try {
        $containers = docker ps --format "{{.Names}}" | Out-String
        
        if ($containers -match "rez-application") {
            Write-Success "Main application container is running"
        } else {
            Write-Error "Main application container is not running"
            return $false
        }
        
        if ($containers -match "rez-payment-checker") {
            Write-Success "Payment checker container is running"
        } else {
            Write-Error "Payment checker container is not running"
            return $false
        }
        
        return $true
    } catch {
        Write-Error "Error checking containers: $_"
        return $false
    }
}

# Function to check application accessibility
function Test-Application {
    Write-Host "🌐 Checking application accessibility..." -ForegroundColor Blue
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method HEAD -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Success "Application is accessible on http://localhost:3001"
            return $true
        }
    } catch {
        Write-Error "Application is not accessible on http://localhost:3001"
        Write-Info "Check if containers are running and port 3001 is available"
        return $false
    }
}

# Function to check payment API
function Test-PaymentAPI {
    Write-Host "💰 Checking payment deadline API..." -ForegroundColor Blue
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/check-payment-deadlines" -Method GET -TimeoutSec 10 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 401) {
            Write-Success "Payment deadline API is responding"
            if ($response.StatusCode -eq 401) {
                Write-Info "API returns 401 (expected without auth token)"
            }
            return $true
        }
    } catch {
        # Check if it's a 401 error (which is expected)
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Success "Payment deadline API is responding"
            Write-Info "API returns 401 (expected without auth token)"
            return $true
        } else {
            Write-Error "Payment deadline API is not responding: $_"
            return $false
        }
    }
}

# Function to check environment configuration
function Test-Environment {
    Write-Host "⚙️ Checking environment configuration..." -ForegroundColor Blue
    
    if (Test-Path ".env.local") {
        Write-Success "Environment file (.env.local) exists"
        
        # Read environment file
        $envContent = Get-Content ".env.local" -Raw
        
        if ($envContent -match "NEXT_PUBLIC_FIREBASE_PROJECT_ID=(.+)") {
            Write-Success "Firebase project ID is configured"
        } else {
            Write-Warning "Firebase project ID is not set"
        }
        
        if ($envContent -match "NEXT_PUBLIC_BASE_URL=(.+)") {
            $baseUrl = $matches[1]
            Write-Success "Base URL is configured: $baseUrl"
        } else {
            Write-Warning "Base URL is not set"
        }
        
        if ($envContent -match "PAYMENT_CHECK_TOKEN=(.+)") {
            Write-Success "Payment check token is configured"
        } else {
            Write-Warning "Payment check token is not set"
        }
        
        return $true
    } else {
        Write-Error "Environment file (.env.local) not found"
        Write-Info "Copy .env.local.example to .env.local and configure it"
        return $false
    }
}

# Function to check cron job in payment checker
function Test-CronJob {
    Write-Host "⏰ Checking payment checker cron job..." -ForegroundColor Blue
    
    try {
        $cronOutput = docker exec rez-payment-checker crontab -l 2>$null
        if ($cronOutput -match "curl") {
            Write-Success "Payment checker cron job is configured"
            Write-Host "   $($cronOutput.Split("`n")[0])" -ForegroundColor Gray
            return $true
        } else {
            Write-Error "Payment checker cron job is not configured"
            return $false
        }
    } catch {
        Write-Error "Cannot check cron job: $_"
        return $false
    }
}

# Function to show container logs summary
function Show-LogsSummary {
    Write-Host "📋 Recent logs summary..." -ForegroundColor Blue
    
    Write-Host "🔸 Application logs (last 3 lines):" -ForegroundColor Cyan
    try {
        $appLogs = docker logs rez-application --tail 3 2>$null
        if ($appLogs) {
            $appLogs.Split("`n") | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        }
    } catch {
        Write-Error "Cannot read application logs"
    }
    
    Write-Host ""
    Write-Host "🔸 Payment checker logs (last 3 lines):" -ForegroundColor Cyan
    try {
        $checkerLogs = docker logs rez-payment-checker --tail 3 2>$null
        if ($checkerLogs) {
            $checkerLogs.Split("`n") | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
        }
    } catch {
        Write-Error "Cannot read payment checker logs"
    }
}

# Function to show system resources
function Show-Resources {
    Write-Host "📊 System resources:" -ForegroundColor Blue
    
    try {
        $stats = docker stats --no-stream --format "table {{.Name}}`t{{.CPUPerc}}`t{{.MemUsage}}" 2>$null
        if ($stats) {
            Write-Host $stats -ForegroundColor Gray
        }
    } catch {
        Write-Info "Cannot get container stats"
    }
}

# Main verification flow
function Start-Verification {
    Write-Host "Starting system verification..." -ForegroundColor Blue
    Write-Host ""
    
    $allPassed = $true
    
    # Run all checks
    if (-not (Test-Environment)) { $allPassed = $false }
    Write-Host ""
    
    if (-not (Test-Containers)) { $allPassed = $false }
    Write-Host ""
    
    if (-not (Test-Application)) { $allPassed = $false }
    Write-Host ""
    
    if (-not (Test-PaymentAPI)) { $allPassed = $false }
    Write-Host ""
    
    if (-not (Test-CronJob)) { $allPassed = $false }
    Write-Host ""
    
    Show-LogsSummary
    Write-Host ""
    
    Show-Resources
    Write-Host ""
    
    # Final status
    if ($allPassed) {
        Write-Host "🎉 System verification completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Info "Your HIT Student Accommodation Portal is ready to use"
        Write-Info "Access the application at: http://localhost:3001"
        Write-Info "Payment checker will run every 6 hours automatically"
    } else {
        Write-Host "⚠️ System verification found issues" -ForegroundColor Yellow
        Write-Host ""
        Write-Info "Please review the errors above and fix them"
        Write-Info "Check the troubleshooting section in README.md for help"
    }
    
    return $allPassed
}

# Run the verification
Start-Verification
