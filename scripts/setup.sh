#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art
echo -e "${CYAN}"
cat << "EOF"
 _____     _ _ _                      _             
|_   _|_ _| | (_)_ __  __ _ _ _  ___| |_ _ _ __ _  
  | |/ _` | | | | '  \/ _` | ' \/ -_)  _| '_/ _` | 
  |_|\__,_|_|_|_|_|_|_\__,_|_||_\___|\__|_| \__,_| 
                                                    
EOF
echo -e "${NC}"

# Random dev jokes
JOKES=(
    "Why do programmers prefer dark mode? Because light attracts bugs! 🪲"
    "Why did the developer go broke? Because he used up all his cache! 💸"
    "What's a programmer's favorite hangout spot? Foo Bar! 🍻"
    "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25! 🎃"
    "Why did the functional programmer get thrown out of school? Because they refused to take classes! 🎓"
    "What's a programmer's favorite place in the house? The REST room! 🚽"
    "Why do programmers hate nature? It has too many bugs! 🌳"
    "What did the programmer say to the rubber duck? You're the only one who understands me! 🦆"
)

echo -e "${GREEN}🚀 Setting up Tallimantra development environment...${NC}\n"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js (version >= 18) from https://nodejs.org${NC}"
    exit 1
fi

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    echo -e "${YELLOW}Please install npm${NC}"
    exit 1
fi

# Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm install

# Set up environment variables
SHELL_CONFIG=""
if [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
    SHELL_CONFIG="$HOME/.bashrc"
else
    echo -e "${YELLOW}⚠️  Unknown shell. Please manually add environment variables to your shell config${NC}"
    exit 1
fi

# Add environment variables if they don't exist
if ! grep -q "TALLIMANTRA_ROOT" "$SHELL_CONFIG"; then
    echo -e "\n# Tallimantra Environment Setup" >> "$SHELL_CONFIG"
    echo "export TALLIMANTRA_ROOT=\"$(pwd)\"" >> "$SHELL_CONFIG"
    echo "alias ai-setup=\"cat \$TALLIMANTRA_ROOT/docs/guides/ai-chat-setup.md\"" >> "$SHELL_CONFIG"
    echo "alias ai-context=\"node \$TALLIMANTRA_ROOT/scripts/get-context.js\"" >> "$SHELL_CONFIG"
fi

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo -e "${YELLOW}Please run: source $SHELL_CONFIG${NC}"

# Print random joke
RANDOM_JOKE=${JOKES[$RANDOM % ${#JOKES[@]}]}
echo -e "\n${PURPLE}💡 Random dev joke:${NC}"
echo -e "${CYAN}$RANDOM_JOKE${NC}\n"