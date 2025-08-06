#!/bin/bash

# Script to verify the project setup
echo "🔍 Verifying project setup..."

# Check if Bun is installed
if command -v bun &> /dev/null; then
    echo "✅ Bun is installed: $(bun --version)"
else
    echo "❌ Bun is not installed. Please run: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Check if package.json has the correct packageManager field
if grep -q '"packageManager": "bun@1.0.0"' package.json; then
    echo "✅ package.json correctly configured for Bun"
else
    echo "❌ package.json not configured for Bun"
    exit 1
fi

# Check if expo-updates is installed
if grep -q '"expo-updates"' package.json; then
    echo "✅ expo-updates is installed"
else
    echo "❌ expo-updates is not installed"
    exit 1
fi

# Check if app.json has updates configuration
if grep -q '"updates"' app.json; then
    echo "✅ app.json has updates configuration"
else
    echo "❌ app.json missing updates configuration"
    exit 1
fi

# Check if runtimePolicy is set to fingerprint
if grep -q '"runtimePolicy": "fingerprint"' app.json; then
    echo "✅ Fingerprint runtime policy is configured"
else
    echo "❌ Fingerprint runtime policy not configured"
    exit 1
fi

# Check if eas.json has updates configuration
if grep -q '"updates"' eas.json; then
    echo "✅ eas.json has updates configuration"
else
    echo "❌ eas.json missing updates configuration"
    exit 1
fi

echo ""
echo "🎉 All checks passed! The project is properly configured."
echo ""
echo "You can now run:"
echo "  bun install    # Install dependencies"
echo "  bun start      # Start development server"