#!/bin/bash

# CI/CD Verification Script
# Verifies that all CI/CD components are properly configured

echo "🔍 DVS CI/CD Verification"
echo "=========================="
echo ""

# Check workflow files
echo "📋 Checking GitHub Actions workflows..."
if [ -f ".github/workflows/ci.yml" ]; then
    echo "✅ Main CI/CD pipeline found"
else
    echo "❌ Main CI/CD pipeline missing"
fi

if [ -f ".github/workflows/contract-deploy.yml" ]; then
    echo "✅ Contract deployment workflow found"
else
    echo "❌ Contract deployment workflow missing"
fi

if [ -f ".github/workflows/vercel-deploy.yml" ]; then
    echo "✅ Vercel deployment info found"
else
    echo "❌ Vercel deployment info missing"
fi

echo ""

# Check documentation
echo "📚 Checking documentation..."
if [ -f "CI_CD_GUIDE.md" ]; then
    echo "✅ CI/CD guide found"
else
    echo "❌ CI/CD guide missing"
fi

if [ -f "CI_CD_QUICK_REFERENCE.md" ]; then
    echo "✅ Quick reference found"
else
    echo "❌ Quick reference missing"
fi

if [ -f "CI_CD_IMPLEMENTATION_SUMMARY.md" ]; then
    echo "✅ Implementation summary found"
else
    echo "❌ Implementation summary missing"
fi

echo ""

# Check build configuration
echo "🔧 Checking build configuration..."
if [ -f "package.json" ]; then
    if grep -q "\"build\":" package.json; then
        echo "✅ Build script configured"
    else
        echo "❌ Build script missing"
    fi
    
    if grep -q "\"lint\":" package.json; then
        echo "✅ Lint script configured"
    else
        echo "⚠️  Lint script missing (optional)"
    fi
fi

if [ -f "vite.config.js" ]; then
    echo "✅ Vite config found"
else
    echo "❌ Vite config missing"
fi

echo ""

# Check contract configuration
echo "🦀 Checking contract configuration..."
if [ -f "contracts/Cargo.toml" ]; then
    echo "✅ Workspace Cargo.toml found"
else
    echo "❌ Workspace Cargo.toml missing"
fi

if [ -f "contracts/certificate_contract/Cargo.toml" ]; then
    echo "✅ CertificateContract Cargo.toml found"
else
    echo "❌ CertificateContract Cargo.toml missing"
fi

if [ -f "contracts/reward_contract/Cargo.toml" ]; then
    echo "✅ RewardContract Cargo.toml found"
else
    echo "❌ RewardContract Cargo.toml missing"
fi

echo ""

# Test local builds
echo "🧪 Testing local builds..."
echo "Frontend build test:"
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
fi

echo ""
echo "Contract build test:"
if command -v cargo &> /dev/null; then
    if rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
        echo "✅ WASM target installed"
        cd contracts
        if cargo build --target wasm32-unknown-unknown --release > /dev/null 2>&1; then
            echo "✅ Contracts build successfully"
        else
            echo "❌ Contract build failed"
        fi
        cd ..
    else
        echo "⚠️  WASM target not installed (run: rustup target add wasm32-unknown-unknown)"
    fi
else
    echo "⚠️  Cargo not installed (contracts cannot be built)"
fi

echo ""
echo "=========================="
echo "✅ CI/CD verification complete!"
echo ""
echo "Next steps:"
echo "1. Commit and push to trigger CI/CD pipeline"
echo "2. Check Actions tab on GitHub for build status"
echo "3. Configure environment variables in Vercel"
echo "4. Deploy contracts using manual workflow"
