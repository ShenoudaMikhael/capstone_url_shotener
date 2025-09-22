#!/bin/bash

# URL Shortener API Test Script
echo "Testing URL Shortener API..."
echo "================================"

BASE_URL="http://localhost:3000"

# Test 1: Health Check
echo "1. Testing health check endpoint..."
curl -X GET "${BASE_URL}/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Shorten URL without custom code
echo "2. Testing URL shortening (auto-generated code)..."
curl -X POST "${BASE_URL}/urls/shorten" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 3: Shorten URL with custom code
echo "3. Testing URL shortening (custom code)..."
curl -X POST "${BASE_URL}/urls/shorten" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.github.com", "customCode": "github"}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Get URL stats
echo "4. Testing URL stats..."
curl -X GET "${BASE_URL}/urls/stats/github" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 5: Get all URLs
echo "5. Testing get all URLs..."
curl -X GET "${BASE_URL}/urls" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n\n"

# Test 6: Invalid URL test
echo "6. Testing invalid URL..."
curl -X POST "${BASE_URL}/urls/shorten" \
  -H "Content-Type: application/json" \
  -d '{"url": "not-a-valid-url"}' \
  -w "\nStatus: %{http_code}\n\n"

echo "API Testing Complete!"