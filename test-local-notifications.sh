#!/bin/bash
# Comprehensive local notification testing script
# Usage: ./test-local-notifications.sh

echo "🧪 Local Notification Testing Suite"
echo "===================================="

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "${RED}❌ Server is not running!${NC}"
  echo "Please start the server with: npm run dev"
  exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Test 1: Check environment variables
echo -e "${BLUE}1️⃣  Checking environment variables...${NC}"
DEBUG_RESPONSE=$(curl -s http://localhost:3000/api/admin/debug)
echo "$DEBUG_RESPONSE" | jq '.envStatus'

if echo "$DEBUG_RESPONSE" | jq -e '.issues != "None"' > /dev/null 2>&1; then
  ISSUES=$(echo "$DEBUG_RESPONSE" | jq -r '.issues | join(", ")')
  echo -e "${YELLOW}⚠️  Missing: $ISSUES${NC}"
fi
echo ""

# Test 2: Check cron job status
echo -e "${BLUE}2️⃣  Checking cron job status...${NC}"
STATUS_RESPONSE=$(curl -s http://localhost:3000/api/admin/status)
echo "$STATUS_RESPONSE" | jq '.'
echo ""

# Test 3: Check subscription count
echo -e "${BLUE}3️⃣  Checking stored subscriptions...${NC}"
SUBS_RESPONSE=$(curl -s http://localhost:3000/api/notifications/subscribe)
echo "$SUBS_RESPONSE" | jq '.'
echo ""

# Test 4: Send test notification
echo -e "${BLUE}4️⃣  Sending test notification to all subscribers...${NC}"
NOTIFY_RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/test-notify \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Notification","body":"Check browser for notification!","type":"test"}')
echo "$NOTIFY_RESPONSE" | jq '.'
echo ""

# Test 5: Manual tests to perform
echo -e "${BLUE}5️⃣  Manual browser tests:${NC}"
echo "   1. Open DevTools (F12) → Console tab"
echo "   2. Reload the page and look at the logs"
echo "   3. Click the purple 'Yoqish' button to request notification permission"
echo "   4. Watch for these console logs:"
echo -e "${YELLOW}      ✅ Notification permission granted${NC}"
echo -e "${YELLOW}      ⏳ Waiting for service worker...${NC}"
echo -e "${YELLOW}      ✅ Service worker is ready${NC}"
echo -e "${YELLOW}      🔑 VAPID Key is set${NC}"
echo -e "${YELLOW}      📝 Subscribing to push manager...${NC}"
echo -e "${YELLOW}      ✅ Push subscription obtained${NC}"
echo -e "${YELLOW}      📤 Sending subscription to backend...${NC}"
echo -e "${YELLOW}      ✅ Subscribed to push notifications${NC}"
echo -e "${YELLOW}      🚀 Initializing cron jobs...${NC}"
echo -e "${YELLOW}      ✅ Cron jobs initialized${NC}"
echo ""

# Test 6: Monitor server logs
echo -e "${BLUE}6️⃣  Monitor server logs in another terminal:${NC}"
echo -e "${YELLOW}   npm run dev 2>&1 | grep -E '✅|❌|⏰|🚀|📤|🔑'${NC}"
echo ""

echo -e "${GREEN}✅ Tests complete!${NC}"
echo ""
echo -e "${BLUE}📋 Troubleshooting:${NC}"
echo "   • No console logs? → Check VAPID key in .env.local"
echo "   • Service worker not ready? → Check DevTools → Application → Service Workers"
echo "   • Notification not received? → Run step 4 again and check browser permissions"
echo "   • Build errors? → npm run build"
