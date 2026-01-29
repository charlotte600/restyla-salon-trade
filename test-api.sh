#!/bin/bash

# Test Script for Restyla Salon Trade API

BASE_URL="http://localhost:3000"

echo "Testing Restyla Salon Trade API..."
echo ""

# Test 1: Valid order (2 items)
echo "Test 1: Valid order with 2 items (should succeed)"
curl -X POST "$BASE_URL/api/draft-order" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "variants": [
      {"variantId": "gid://shopify/ProductVariant/123", "quantity": 1},
      {"variantId": "gid://shopify/ProductVariant/456", "quantity": 1}
    ]
  }' 
echo ""
echo ""

# Test 2: Invalid order (>2 items)
echo "Test 2: Invalid order with 3 items (should fail)"
curl -X POST "$BASE_URL/api/draft-order" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "variants": [
      {"variantId": "gid://shopify/ProductVariant/123", "quantity": 1},
      {"variantId": "gid://shopify/ProductVariant/456", "quantity": 1},
      {"variantId": "gid://shopify/ProductVariant/789", "quantity": 1}
    ]
  }'
echo ""
echo ""

# Test 3: Invalid request (missing email)
echo "Test 3: Missing email (should fail)"
curl -X POST "$BASE_URL/api/draft-order" \
  -H "Content-Type: application/json" \
  -d '{
    "variants": [
      {"variantId": "gid://shopify/ProductVariant/123", "quantity": 1}
    ]
  }'
echo ""
