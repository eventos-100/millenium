}

# Install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    npm install
    print_status "Dependencies installed successfully"
    echo ""
}

# Generate TypeScript types
generate_types() {
    echo -e "${BLUE}🔧 Generating TypeScript types...${NC}"
    
    if command -v wrangler &> /dev/null; then
        wrangler types
    else
        npx wrangler types
    fi
    
    print_status "TypeScript types generated"
    echo ""
}

# Local development setup
setup_local() {
    echo -e "${BLUE}🏠 Setting up local development...${NC}"
    
    # Apply migrations locally
    echo "Applying database migrations locally..."
    if command -v wrangler &> /dev/null; then
        wrangler d1 migrations apply automotive_db --local
    else
        npx wrangler d1 migrations apply automotive_db --local
    fi
    
    print_status "Local database migrations applied"
    
    # Test local database
    echo "Testing local database connection..."
    if command -v wrangler &> /dev/null; then
        wrangler d1 execute automotive_db --local --command "SELECT 'Database connection successful' as status"
    else
        npx wrangler d1 execute automotive_db --local --command "SELECT 'Database connection successful' as status"
    fi
    
    print_status "Local development environment ready"
    echo ""
}

# Deploy to Cloudflare
deploy_cloudflare() {
    echo -e "${BLUE}☁️  Deploying to Cloudflare...${NC}"
    
    # Deploy the worker
    if command -v wrangler &> /dev/null; then
        wrangler deploy
    else
        npx wrangler deploy
    fi
    
    print_status "Worker deployed to Cloudflare"
    
    # Apply production migrations
    echo "Applying production database migrations..."
    if command -v wrangler &> /dev/null; then
        wrangler d1 migrations apply automotive_db
    else
        npx wrangler d1 migrations apply automotive_db
    fi
    
    print_status "Production database migrations applied"
    echo ""
}

# Test deployment
test_deployment() {
    echo -e "${BLUE}🧪 Testing deployment...${NC}"
    
    # Get the worker URL
    if [ "$ENVIRONMENT" = "local" ]; then
        WORKER_URL="http://localhost:8787"
        echo "Testing local worker at: $WORKER_URL"
    else
        WORKER_URL="https://${PROJECT_NAME}.your-subdomain.workers.dev"
        echo "Testing production worker at: $WORKER_URL"
    fi
    
    # Test health endpoint
    echo "Testing health endpoint..."
    if curl -s "${WORKER_URL}/health" > /dev/null; then
        print_status "Health endpoint responding"
    else
        print_warning "Health endpoint not responding (this is normal for local setup before starting dev server)"
    fi
    
    echo ""
}

# Show next steps
show_next_steps() {
    echo -e "${BLUE}🎯 Next Steps:${NC}"
    echo ""
    
    if [ "$ENVIRONMENT" = "local" ]; then
        echo -e "${GREEN}To start local development:${NC}"
        echo "  npm run dev"
        echo ""
        echo -e "${GREEN}To test API endpoints:${NC}"
        echo "  curl http://localhost:8787/health"
        echo "  curl -X POST http://localhost:8787/api/leads -H 'Content-Type: application/json' -d '{\"name\":\"Test\",\"email\":\"test@example.com\"}'"
        echo ""
        echo -e "${GREEN}To deploy to production:${NC}"
        echo "  ./deploy.sh production"
    else
        echo -e "${GREEN}Update wrangler.json with real IDs:${NC}"
        echo "  1. Copy D1 database ID from Cloudflare dashboard"
        echo "  2. Copy KV namespace IDs from dashboard"
        echo "  3. Update wrangler.json with real IDs"
        echo "  4. Redeploy: ./deploy.sh production"
        echo ""
        echo -e "${GREEN}Test production endpoints:${NC}"
        echo "  curl https://${PROJECT_NAME}.your-subdomain.workers.dev/health"
    fi
    
    echo ""
    echo -e "${GREEN}View logs:${NC}"
    echo "  wrangler tail"
    echo ""
    echo -e "${GREEN}Database console:${NC}"
    if [ "$ENVIRONMENT" = "local" ]; then
        echo "  npm run d1:console:local --command \"SELECT * FROM leads\""
    else
        echo "  npm run d1:console --command \"SELECT * FROM leads\""
    fi
    echo ""
}

# Main execution
main() {
    check_prerequisites
    install_dependencies
    generate_types
    
    case $ENVIRONMENT in
        "local")
            setup_local
            ;;
        "staging"|"production")
            deploy_cloudflare
            ;;
        *)
            print_error "Invalid environment: $ENVIRONMENT"
            echo "Usage: ./deploy.sh [local|staging|production]"
            exit 1
            ;;
    esac
    
    test_deployment
    show_next_steps
    
    print_status "Deployment complete! 🎉"
}

# Run main function
main