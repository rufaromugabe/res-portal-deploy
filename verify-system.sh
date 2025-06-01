#!/bin/bash

# HIT Student Accommodation Portal - System Verification Script
# Run this script after deployment to verify everything is working correctly

echo "🏫 HIT Student Accommodation Portal - System Verification"
echo "========================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Function to check if containers are running
check_containers() {
    echo "🐳 Checking Docker containers..."
    
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "rez-application"; then
        print_status "Main application container is running"
    else
        print_error "Main application container is not running"
        return 1
    fi
    
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "rez-payment-checker"; then
        print_status "Payment checker container is running"
    else
        print_error "Payment checker container is not running"
        return 1
    fi
}

# Function to check application accessibility
check_application() {
    echo "🌐 Checking application accessibility..."
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 | grep -q "200"; then
        print_status "Application is accessible on http://localhost:3001"
    else
        print_error "Application is not accessible on http://localhost:3001"
        print_info "Check if containers are running and port 3001 is available"
        return 1
    fi
}

# Function to check payment API
check_payment_api() {
    echo "💰 Checking payment deadline API..."
    
    # Load environment variables
    if [ -f .env.local ]; then
        source .env.local
    fi
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/check-payment-deadlines)
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "401" ]; then
        print_status "Payment deadline API is responding"
        if [ "$status_code" = "401" ]; then
            print_info "API returns 401 (expected without auth token)"
        fi
    else
        print_error "Payment deadline API is not responding (status: $status_code)"
        return 1
    fi
}

# Function to check environment configuration
check_environment() {
    echo "⚙️ Checking environment configuration..."
    
    if [ -f .env.local ]; then
        print_status "Environment file (.env.local) exists"
        
        # Check critical variables
        source .env.local
        
        if [ -n "$NEXT_PUBLIC_FIREBASE_PROJECT_ID" ]; then
            print_status "Firebase project ID is configured"
        else
            print_warning "Firebase project ID is not set"
        fi
        
        if [ -n "$NEXT_PUBLIC_BASE_URL" ]; then
            print_status "Base URL is configured: $NEXT_PUBLIC_BASE_URL"
        else
            print_warning "Base URL is not set"
        fi
        
        if [ -n "$PAYMENT_CHECK_TOKEN" ]; then
            print_status "Payment check token is configured"
        else
            print_warning "Payment check token is not set"
        fi
    else
        print_error "Environment file (.env.local) not found"
        print_info "Copy .env.local.example to .env.local and configure it"
        return 1
    fi
}

# Function to check cron job in payment checker
check_cron_job() {
    echo "⏰ Checking payment checker cron job..."
    
    if docker exec rez-payment-checker crontab -l 2>/dev/null | grep -q "curl"; then
        print_status "Payment checker cron job is configured"
        docker exec rez-payment-checker crontab -l | head -1
    else
        print_error "Payment checker cron job is not configured"
        return 1
    fi
}

# Function to show container logs summary
show_logs_summary() {
    echo "📋 Recent logs summary..."
    
    echo "🔸 Application logs (last 5 lines):"
    docker logs rez-application --tail 5 2>/dev/null || print_error "Cannot read application logs"
    
    echo ""
    echo "🔸 Payment checker logs (last 5 lines):"
    docker logs rez-payment-checker --tail 5 2>/dev/null || print_error "Cannot read payment checker logs"
}

# Function to show system resources
show_resources() {
    echo "📊 System resources:"
    
    if command -v docker stats &> /dev/null; then
        echo "Container resource usage:"
        timeout 3 docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || print_info "Cannot get container stats"
    fi
}

# Main verification flow
main() {
    echo "Starting system verification..."
    echo ""
    
    local exit_code=0
    
    # Run all checks
    check_environment || exit_code=1
    echo ""
    
    check_containers || exit_code=1
    echo ""
    
    check_application || exit_code=1
    echo ""
    
    check_payment_api || exit_code=1
    echo ""
    
    check_cron_job || exit_code=1
    echo ""
    
    show_logs_summary
    echo ""
    
    show_resources
    echo ""
    
    # Final status
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}🎉 System verification completed successfully!${NC}"
        echo ""
        print_info "Your HIT Student Accommodation Portal is ready to use"
        print_info "Access the application at: http://localhost:3001"
        print_info "Payment checker will run every 6 hours automatically"
    else
        echo -e "${RED}⚠️ System verification found issues${NC}"
        echo ""
        print_info "Please review the errors above and fix them"
        print_info "Check the troubleshooting section in README.md for help"
    fi
    
    exit $exit_code
}

# Run main function
main "$@"
