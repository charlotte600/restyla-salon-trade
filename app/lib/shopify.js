import axios from 'axios';

/**
 * Create a Shopify Draft Order using Admin API with 50% salon discount
 */
export async function createDraftOrder({
  email,
  variants,
  shop,
  accessToken,
}) {
  const query = `
    mutation CreateDraftOrder($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          invoiceUrl
          order {
            id
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const lineItems = variants.map(v => ({
    variantId: v.variantId,
    quantity: v.quantity,
  }));

  const variables = {
    input: {
      lineItems,
      email,
      appliedDiscount: {
        description: 'Salon Trade 50% Discount',
        percentageValue: 50.0
      },
      customAttributes: [
        {
          key: 'order_source',
          value: 'salon_trade_app'
        }
      ]
    }
  };

  try {
    const response = await axios.post(
      `https://${shop}/admin/api/2024-01/graphql.json`,
      { query, variables },
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data.data?.draftOrderCreate;
    if (data?.userErrors?.length > 0) {
      throw new Error(`Shopify API Error: ${data.userErrors[0].message}`);
    }

    return {
      draftOrderId: data?.draftOrder?.id,
      invoiceUrl: data?.draftOrder?.invoiceUrl,
    };
  } catch (error) {
    console.error('Draft order creation failed:', error.message);
    throw error;
  }
}

/**
 * Validate total quantity across variants
 */
export function validateQuantity(variants) {
  const total = variants.reduce((sum, v) => sum + v.quantity, 0);
  
  if (total > 2) {
    return {
      valid: false,
      message: `Total quantity (${total}) exceeds maximum of 2. Please resubmit with 2 or fewer items.`,
    };
  }

  if (total === 0) {
    return {
      valid: false,
      message: 'Please select at least 1 item.',
    };
  }

  return { valid: true };
}
