#!/bin/bash

# Millenium Automotive - Complete Production Setup
# This script handles the complete deployment and configuration

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}🏆 MILLENIUM AUTOMOTIVE - PRODUCTION SETUP${NC}"
echo "==============================================="

# Check environment
check_environment() {
    echo -e "\n${BLUE}🔍 Environment Check${NC}"
    
    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
    else
        echo -e "${RED}❌ Node.js not found${NC}"
        exit 1
    fi
    
    # Check npm
    if command -v npm >/dev/null 2>&1; then
        echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
    else
        echo -e "${RED}❌ npm not found${NC}"
        exit 1
    fi
    
    # Check Git
    if command -v git >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Git: $(git --version)${NC}"
    else
        echo -e "${RED}❌ Git not found${NC}"
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    echo -e "\n${BLUE}📦 Installing Dependencies${NC}"
    
    if [ -f "package.json" ]; then
        npm install
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        echo -e "${RED}❌ package.json not found${NC}"
        exit 1
    fi
}

# Setup local development
setup_local() {
    echo -e "\n${BLUE}🏠 Local Development Setup${NC}"
    
    # Create local database directory if needed
    mkdir -p .wrangler/d1
    
    echo -e "${GREEN}✅ Local environment prepared${NC}"
    echo -e "${YELLOW}📋 To start development:${NC}"
    echo "  1. Run: npx wrangler dev"
    echo "  2. Visit: http://localhost:8787"
    echo "  3. Test: curl http://localhost:8787/health"
}

# Webflow Cloud setup instructions
webflow_cloud_setup() {
    echo -e "\n${BLUE}☁️ Webflow Cloud Setup Instructions${NC}"
    
    echo -e "${GREEN}📋 Step 1: Create Webflow Cloud Project${NC}"
    echo "  1. Go to: https://webflow.com/cloud"
    echo "  2. Click 'Create new project'"
    echo "  3. Connect GitHub repository: eventos-100/millenium"
    echo "  4. Select branch: main"
    echo "  5. Configure build settings:"
    echo "     - Framework: Custom/Node.js"
    echo "     - Build command: npm run build"
    echo "     - Output directory: dist"
    echo "     - Install command: npm install"
    
    echo -e "\n${GREEN}📋 Step 2: Environment Variables${NC}"
    echo "  Add these in Webflow Cloud project settings:"
    echo "  - WEBFLOW_SITE_ID=687bbc3b0bb3dd57d6c1fd83"
    echo "  - WEBFLOW_API_TOKEN=your_token_here"
    echo "  - NODE_ENV=production"
    
    echo -e "\n${GREEN}📋 Step 3: Deploy${NC}"
    echo "  1. Click 'Deploy' in Webflow Cloud dashboard"
    echo "  2. Monitor build logs"
    echo "  3. Access at: https://your-site.webflow.app"
}

# Cloudflare setup instructions
cloudflare_setup() {
    echo -e "\n${BLUE}🔧 Cloudflare Workers Setup${NC}"
    
    echo -e "${GREEN}📋 Cloudflare Authentication${NC}"
    echo "  Run these commands to authenticate:"
    echo "  1. npx wrangler login"
    echo "  2. npx wrangler whoami"
    
    echo -e "\n${GREEN}📋 Database Setup${NC}"
    echo "  1. Create D1 database:"
    echo "     npx wrangler d1 create millenium_db"
    echo "  2. Copy the database ID from output"
    echo "  3. Update wrangler.json with real database ID"
    echo "  4. Apply migrations:"
    echo "     npx wrangler d1 migrations apply millenium_db"
    
    echo -e "\n${GREEN}📋 KV Storage Setup${NC}"
    echo "  1. Create KV namespaces:"
    echo "     npx wrangler kv:namespace create CACHE"
    echo "     npx wrangler kv:namespace create SESSIONS"
    echo "  2. Copy the namespace IDs from output"
    echo "  3. Update wrangler.json with real KV IDs"
    
    echo -e "\n${GREEN}📋 R2 Storage Setup${NC}"
    echo "  1. Create R2 bucket:"
    echo "     npx wrangler r2 bucket create millenium-media"
    echo "  2. Verify bucket creation:"
    echo "     npx wrangler r2 bucket list"
    
    echo -e "\n${GREEN}📋 Deploy Worker${NC}"
    echo "  1. Deploy to Cloudflare:"
    echo "     npx wrangler deploy"
    echo "  2. Test deployment:"
    echo "     curl https://millenium-automotive.your-subdomain.workers.dev/health"
}

# API testing
test_apis() {
    echo -e "\n${BLUE}🧪 API Testing Guide${NC}"
    
    echo -e "${GREEN}📋 Health Check${NC}"
    echo "  curl http://localhost:8787/health"
    echo "  # Expected: 200 OK with site info"
    
    echo -e "\n${GREEN}📋 Create Premium Lead${NC}"
    echo '  curl -X POST http://localhost:8787/api/leads \'
    echo '    -H "Content-Type: application/json" \'
    echo '    -d '"'"'{'
    echo '      "name": "Premium Client",'
    echo '      "email": "client@millenium.com",'
    echo '      "phone": "+1-555-LUXURY",'
    echo '      "vehicle_interest": "Mercedes-Benz CLE Cabriolet",'
    echo '      "message": "Interested in luxury test drive experience"'
    echo '    }'"'"
    
    echo -e "\n${GREEN}📋 Save Vehicle Configuration${NC}"
    echo '  curl -X POST http://localhost:8787/api/configurations \'
    echo '    -H "Content-Type: application/json" \'
    echo '    -d '"'"'{'
    echo '      "session_id": "premium_session_123",'
    echo '      "vehicle_id": "mercedes-cle-cabriolet",'
    echo '      "vehicle_name": "Mercedes-Benz CLE Cabriolet",'
    echo '      "configuration": {'
    echo '        "trim": "450 4MATIC",'
    echo '        "exterior_color": "Obsidian Black",'
    echo '        "interior_color": "Macchiato Beige",'
    echo '        "packages": ["Premium Package", "Driver Assistance Package"]'
    echo '      },'
    echo '      "total_price": 75000,'
    echo '      "monthly_payment": 1299'
    echo '    }'"'"
    
    echo -e "\n${GREEN}📋 Request Concierge Test Drive${NC}"
    echo '  curl -X POST http://localhost:8787/api/test-drive \'
    echo '    -H "Content-Type: application/json" \'
    echo '    -d '"'"'{'
    echo '      "name": "VIP Client",'
    echo '      "email": "vip@millenium.com",'
    echo '      "phone": "+1-555-VIP-TEST",'
    echo '      "vehicle_id": "bmw-z4-sdrive30i-roadster",'
    echo '      "vehicle_name": "BMW Z4 sDrive30i Roadster",'
    echo '      "preferred_date": "2025-08-15",'
    echo '      "preferred_time": "2:00 PM",'
    echo '      "dealer_location": "Beverly Hills Showroom"'
    echo '    }'"'"
}

# Integration guide
integration_guide() {
    echo -e "\n${BLUE}🔗 Webflow Integration Guide${NC}"
    
    echo -e "${GREEN}📋 Form Integration${NC}"
    echo "  Add this JavaScript to Webflow custom code:"
    echo ""
    echo '  <script>'
    echo '  // Lead capture form'
    echo '  document.querySelector("#lead-form").addEventListener("submit", async (e) => {'
    echo '    e.preventDefault();'
    echo '    const formData = new FormData(e.target);'
    echo '    const data = {'
    echo '      name: formData.get("name"),'
    echo '      email: formData.get("email"),'
    echo '      phone: formData.get("phone"),'
    echo '      vehicle_interest: formData.get("vehicle"),'
    echo '      message: formData.get("message")'
    echo '    };'
    echo '    '
    echo '    const response = await fetch("/api/leads", {'
    echo '      method: "POST",'
    echo '      headers: {"Content-Type": "application/json"},'
    echo '      body: JSON.stringify(data)'
    echo '    });'
    echo '    '
    echo '    if (response.ok) {'
    echo '      alert("Thank you! We will contact you soon.");'
    echo '    }'
    echo '  });'
    echo '  </script>'
    
    echo -e "\n${GREEN}📋 Analytics Integration${NC}"
    echo "  Add this to track vehicle interest:"
    echo ""
    echo '  <script>'
    echo '  // Track vehicle page views'
    echo '  if (window.location.pathname.includes("/vehicles/")) {'
    echo '    fetch("/api/analytics", {'
    echo '      method: "POST",'
    echo '      headers: {"Content-Type": "application/json"},'
    echo '      body: JSON.stringify({'
    echo '        event_type: "page_view",'
    echo '        vehicle_id: window.location.pathname.split("/").pop(),'
    echo '        page_url: window.location.href,'
    echo '        user_session_id: sessionStorage.getItem("session_id") || "anonymous"'
    echo '      })'
    echo '    });'
    echo '  }'
    echo '  </script>'
}

# Monitoring setup
monitoring_setup() {
    echo -e "\n${BLUE}📊 Monitoring & Analytics${NC}"
    
    echo -e "${GREEN}📋 Cloudflare Analytics${NC}"
    echo "  1. View worker analytics in Cloudflare dashboard"
    echo "  2. Monitor request volume and response times"
    echo "  3. Set up alerts for errors and performance"
    
    echo -e "\n${GREEN}📋 Database Monitoring${NC}"
    echo "  Query examples:"
    echo "  - Lead count: SELECT COUNT(*) FROM leads;"
    echo "  - Top vehicles: SELECT vehicle_interest, COUNT(*) FROM leads GROUP BY vehicle_interest;"
    echo "  - Recent activity: SELECT * FROM analytics_events WHERE timestamp > datetime('now', '-24 hours');"
    
    echo -e "\n${GREEN}📋 Performance Targets${NC}"
    echo "  • API Response Time: <300ms ⚡"
    echo "  • Database Queries: <50ms 🗄️"
    echo "  • Media Delivery: <2s 📁"
    echo "  • Uptime Target: 99.99% 🎯"
}

# Main execution
main() {
    echo -e "${PURPLE}Starting Millenium Automotive Production Setup...${NC}"
    
    check_environment
    install_dependencies
    setup_local
    webflow_cloud_setup
    cloudflare_setup
    test_apis
    integration_guide
    monitoring_setup
    
    echo -e "\n${PURPLE}==============================================="
    echo -e "🏆 MILLENIUM AUTOMOTIVE SETUP COMPLETE! 🚀"
    echo -e "===============================================${NC}"
    
    echo -e "\n${GREEN}🎯 Next Actions:${NC}"
    echo "  1. 🔐 Authenticate Cloudflare: npx wrangler login"
    echo "  2. 🗄️ Create database: npx wrangler d1 create millenium_db"
    echo "  3. 📦 Create KV namespaces: npx wrangler kv:namespace create CACHE"
    echo "  4. 🪣 Create R2 bucket: npx wrangler r2 bucket create millenium-media"
    echo "  5. 🚀 Deploy worker: npx wrangler deploy"
    echo "  6. ☁️ Setup Webflow Cloud at: https://webflow.com/cloud"
    echo ""
    echo -e "${GREEN}📞 Ready for premium automotive excellence!${NC}"
}

# Run the setup
main