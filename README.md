# Restyla Salon Trade - Shopify App

A custom Shopify Remix app that validates order quantities and creates draft orders with automatic email notifications.

## Features

- ✅ Accept form submissions with customer email and product variants
- ✅ Validate total quantity (max 2 items)
- ✅ Create Shopify Draft Orders via Admin API
- ✅ Auto-email checkout links to customers
- ✅ Auto-email validation errors to customers
- ✅ Production-ready error handling

## Setup

### 1. Install Dependencies

```bash
cd /Users/charlottegillespie/restyla-salon-trade
npm install
```

### 2. Configure Environment

Create `.env.local`:

```
SHOPIFY_SHOP=your-store.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=your_admin_api_token
SENDGRID_API_KEY=your_sendgrid_key (optional)
```

### 3. Run Locally

```bash
npm run dev
```

Visit: `http://localhost:3000`

## API Usage

### Create Draft Order

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

### Response Success (201)

```json
{
  "success": true,
  "draftOrderId": "gid://shopify/DraftOrder/...",
  "invoiceUrl": "https://...",
  "message": "Draft order created and checkout link emailed"
}
```

### Response Error (400)

```json
{
  "error": "Total quantity (3) exceeds maximum of 2. Please resubmit with 2 or fewer items.",
  "emailSent": true
}
```

## How It Works

1. **Customer submits form** with email + variant selections
2. **Server receives POST** to `/api/draft-order`
3. **Validate quantity** - must be ≤ 2 total items
4. **If invalid**: Send error email → return 400
5. **If valid**: Create Shopify Draft Order → Send checkout email → return 201
6. **Customer receives email** with invoice/checkout link

## Email Templates

- `validationErrorEmailTemplate()` - Sent when quantity validation fails
- `checkoutEmailTemplate()` - Sent when draft order created successfully

## Future Enhancements

- SendGrid/Mailgun integration for real email sending
- Webhook support for order completion notifications
- Commission tracking per salon
- Automated Stripe payouts

## File Structure

```
app/
├── lib/
│   ├── shopify.js      (Draft order creation, quantity validation)
│   └── email.js        (Email templates & sending)
├── routes/
│   ├── api.js          (API index)
│   ├── api/
│   │   └── draft-order.js  (Main POST endpoint)
│   ├── index.jsx       (Home page with docs)
│   └── root.jsx        (App layout)
```
