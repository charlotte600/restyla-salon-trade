import { json } from '@remix-run/node';
import { validateQuantity, createDraftOrder } from '~/lib/shopify';
import { sendEmail, validationErrorEmailTemplate, checkoutEmailTemplate } from '~/lib/email';

/**
 * POST /api/draft-order
 * 
 * Request body:
 * {
 *   "email": "customer@example.com",
 *   "variants": [
 *     { "variantId": "gid://shopify/ProductVariant/123", "quantity": 1 },
 *     { "variantId": "gid://shopify/ProductVariant/456", "quantity": 1 }
 *   ]
 * }
 */
export async function action({ request }) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { email, variants } = await request.json();

    // Validate input
    if (!email || !variants || variants.length === 0) {
      return json(
        { error: 'Missing email or variants' },
        { status: 400 }
      );
    }

    // Validate quantity
    const quantityValidation = validateQuantity(variants);
    if (!quantityValidation.valid) {
      // Send validation error email
      await sendEmail({
        to: email,
        subject: 'Order Quantity Issue - Restyla',
        html: validationErrorEmailTemplate(quantityValidation.message),
      });

      return json(
        { 
          error: quantityValidation.message,
          emailSent: true
        },
        { status: 400 }
      );
    }

    // Create draft order in Shopify
    const { draftOrderId, invoiceUrl } = await createDraftOrder({
      email,
      variants,
      shop: process.env.SHOPIFY_SHOP,
      accessToken: process.env.SHOPIFY_ADMIN_API_TOKEN,
    });

    // Send checkout email
    await sendEmail({
      to: email,
      subject: 'Complete Your Restyla Order',
      html: checkoutEmailTemplate(invoiceUrl, email),
    });

    return json(
      {
        success: true,
        draftOrderId,
        invoiceUrl,
        message: 'Draft order created and checkout link emailed',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Draft order error:', error);
    return json(
      { error: error.message || 'Failed to create draft order' },
      { status: 500 }
    );
  }
}
