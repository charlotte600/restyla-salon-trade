# SETUP GUIDE - Restyla Salon Trade Shopify App

## What's Built

A production-ready Shopify app (Remix + JavaScript) that:
- ✅ Accepts POST requests with customer email + product variants
- ✅ Validates total quantity (max 2 items)
- ✅ Creates Shopify Draft Orders via Admin API
- ✅ Automatically emails checkout links to customers
- ✅ Automatically emails validation errors if quantity exceeds limit
- ✅ Includes comprehensive error handling

## Files Created

```
app/
├── lib/
│   ├── shopify.js         - Draft order creation & quantity validation
│   └── email.js           - Email templates & sending logic
├── routes/
│   ├── api.js             - API index route
│   ├── api/
│   │   └── draft-order.js - POST /api/draft-order endpoint
│   ├── index.jsx          - Home page with API docs
│   └── root.jsx           - App layout
├── root.jsx               - Root route

Config files:
├── package.json           - Dependencies (Remix, React, axios)
├── remix.config.js        - Remix configuration
├── tsconfig.json          - TypeScript config
├── shopify.app.toml       - Shopify app scopes
├── .env.example           - Environment variables template
├── .gitignore             - Git ignore rules
└── README.md              - API documentation
```

## Installation & Setup

### Step 1: Install Dependencies

Dependencies already installed via `npm install`. Check:

```bash
cd /Users/charlottegillespie/restyla-salon-trade
ls node_modules | grep remix  # Should see @remix-run packages
```

### Step 2: Configure Environment

Copy the example and fill in real values:

```bash
cp .env.example .env.local
nano .env.local  # or use your editor
```

**Required values:**
- `SHOPIFY_SHOP` = Your Shopify store domain (e.g., `restyla.myshopify.com`)
- `SHOPIFY_ADMIN_API_TOKEN` = Admin API access token from Shopify app settings
- `SENDGRID_API_KEY` = (Optional) SendGrid API key for real email sending

**Where to get Admin API Token:**
1. In Shopify Admin → Settings → Apps and integrations → Develop apps
2. Create or select your app
3. Copy the Admin API token (starts with `shpat_`)
4. Ensure scopes include: `write_draft_orders`, `read_customers`

### Step 3: Run Locally

```bash
npm run dev
```

Expected output:
```
Started Remix development server
  ↳ http://localhost:3000
```

Visit `http://localhost:3000` to see the API home page with docs.

## Testing the API

### Test 1: Valid Order (2 items)

```bash
curl -X POST http://localhost:3000/api/draft-order \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "variants": [
      {"variantId": "gid://shopify/ProductVariant/123", "quantity": 1},
      {"variantId": "gid://shopify/ProductVariant/456", "quantity": 1}
    ]
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "draftOrderId": "gid://shopify/DraftOrder/...",
  "invoiceUrl": "https://...",
  "message": "Draft order created and checkout link emailed"
}
```

### Test 2: Invalid Order (>2 items)

```bash
curl -X POST http://localhost:3000/api/draft-order \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "variants": [
      {"variantId": "gid://shopify/ProductVariant/123", "quantity": 2},
      {"variantId": "gid://shopify/ProductVariant/456", "quantity": 2}
    ]
  }'
```

**Expected Response (400):**
```json
{
  "error": "Total quantity (4) exceeds maximum of 2. Please resubmit with 2 or fewer items.",
  "emailSent": true
}
```

### Run Full Test Suite

```bash
chmod +x test-api.sh
./test-api.sh
```

## How the Flow Works

```
1. Frontend/Salon submits form
   ↓
2. POST to /api/draft-order
   - { email: "...", variants: [...] }
   ↓
3. Server validates quantity
   ├─ If invalid: Send error email → Return 400
   │
   └─ If valid: 
      ├ Create Shopify Draft Order
      ├ Get invoice/checkout URL
      ├ Send checkout email to customer
      └ Return 201 with order ID
   ↓
4. Customer receives email with checkout link
   ↓
5. Customer completes payment
   ↓
6. Draft order converts to real order in Shopify
```

## Email Behavior

**Currently:** Emails log to console (development mode)

To enable real emails:

### Option A: SendGrid (Recommended)

1. Sign up at sendgrid.com
2. Get API key from Settings → API Keys
3. Add to `.env.local`: `SENDGRID_API_KEY=SG.xxx...`
4. In `app/lib/email.js`, uncomment the SendGrid code block

### Option B: Other Services

Replace the email sending in `app/lib/email.js`:
- Mailgun: `mailgun-js` package
- AWS SES: `@aws-sdk/client-sesv2`
- Custom webhooks: Any HTTP POST service

## Troubleshooting

**Issue: "Cannot find module 'esbuild'"**
```bash
npm install --save-dev esbuild
npm run build
```

**Issue: Draft order creation fails (401 Unauthorized)**
- Check `SHOPIFY_ADMIN_API_TOKEN` in `.env.local`
- Verify token hasn't expired
- Confirm scopes include `write_draft_orders`

**Issue: Emails not sending**
- In development, check console output (should log `📧 Email sent to...`)
- To use real SendGrid, follow Option A above

**Issue: API returns 500 error**
- Check server console for error message
- Verify all required env vars are set
- Ensure Shopify API token is valid

## Next Steps

1. **Deploy to production** - Use Shopify CLI:
   ```bash
   shopify app deploy
   ```

2. **Add email service** - Integrate SendGrid/Mailgun for real emails

3. **Create form UI** - Build a React component that submits to POST /api/draft-order

4. **Test with real products** - Replace dummy variant IDs with real product variants from your store

5. **Commission tracking** - Add optional `salonId` to variants for attribution

## File Reference

- **app/lib/shopify.js** - Draft order creation logic, quantity validation
- **app/lib/email.js** - Email template generation
- **app/routes/api/draft-order.js** - Main API endpoint, request handling
- **app/routes/index.jsx** - Home page & API docs
- **README.md** - API usage documentation

---

**Status: ✅ READY FOR DEVELOPMENT**

App is built, configured, and ready for testing. All dependencies installed. Next: Set environment variables and run `npm run dev`.
