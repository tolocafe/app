#!/bin/bash

# Script to install Bun package manager
# This script installs Bun if it's not already installed

echo "Checking if Bun is installed..."

if command -v bun &> /dev/null; then
    echo "✅ Bun is already installed!"
    bun --version
else
    echo "📦 Installing Bun..."
    
    # Install Bun using the official install script
    curl -fsSL https://bun.sh/install | bash
    
    # Source the shell configuration to make bun available
    if [ -f ~/.bashrc ]; then
        source ~/.bashrc
    elif [ -f ~/.zshrc ]; then
        source ~/.zshrc
    fi
    
    echo "✅ Bun installed successfully!"
    echo "Please restart your terminal or run 'source ~/.bashrc' (or ~/.zshrc) to use bun"
    echo ""
    echo "You can now run:"
    echo "  bun install    # Install dependencies"
    echo "  bun start      # Start the development server"
fi