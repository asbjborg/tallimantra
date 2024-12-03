# AI Chat Setup Guide

[Previous sections remain the same until Pro Tips...]

## 💡 Pro Tips

1. **Set Up Your Environment**

   Choose your operating system:

   <details>
   <summary>macOS</summary>

   ```bash
   # First, clone the repo (if you haven't already)
   git clone https://github.com/asbjborg/tallimantra.git
   cd tallimantra
   
   # Add this to ~/.zshrc:
   export TALLIMANTRA_ROOT="$(pwd)"  # Or set it to your preferred location
   
   # Add these helpful aliases:
   alias ai-setup="cat $TALLIMANTRA_ROOT/docs/guides/ai-chat-setup.md"
   alias ai-context="node $TALLIMANTRA_ROOT/scripts/get-context.js"
   
   # Load your updated shell config
   source ~/.zshrc
   ```
   </details>

   <details>
   <summary>Linux</summary>

   ```bash
   # First, clone the repo (if you haven't already)
   git clone https://github.com/asbjborg/tallimantra.git
   cd tallimantra
   
   # Add this to ~/.bashrc:
   export TALLIMANTRA_ROOT="$(pwd)"  # Or set it to your preferred location
   
   # Add these helpful aliases:
   alias ai-setup="cat $TALLIMANTRA_ROOT/docs/guides/ai-chat-setup.md"
   alias ai-context="node $TALLIMANTRA_ROOT/scripts/get-context.js"
   
   # Load your updated shell config
   source ~/.bashrc
   ```
   </details>

   <details>
   <summary>Windows</summary>

   ```powershell
   # First, clone the repo (if you haven't already)
   git clone https://github.com/asbjborg/tallimantra.git
   cd tallimantra
   
   # Add this to your PowerShell profile (create if doesn't exist):
   notepad $PROFILE
   
   # Add these lines to the profile:
   $env:TALLIMANTRA_ROOT = "C:\path\to\tallimantra"  # Update path!
   
   # Add these functions (PowerShell aliases):
   function ai-setup { cat $env:TALLIMANTRA_ROOT\docs\guides\ai-chat-setup.md }
   function ai-context { node $env:TALLIMANTRA_ROOT\scripts\get-context.js }
   
   # Reload your profile
   . $PROFILE
   ```
   </details>

   > 💡 **Note**: Replace the path with your actual project location if not using `$(pwd)`.

[Previous verification and sticky note sections remain...]

## 🔧 Troubleshooting Setup

1. **Environment Variables Not Working**
   ```bash
   # Check if variable is set
   echo $TALLIMANTRA_ROOT  # (macOS/Linux)
   echo %TALLIMANTRA_ROOT% # (Windows CMD)
   echo $env:TALLIMANTRA_ROOT # (Windows PowerShell)
   
   # If not set, check your shell config:
   cat ~/.zshrc     # macOS
   cat ~/.bashrc    # Linux
   cat $PROFILE     # Windows PowerShell
   ```

2. **Aliases Not Found**
   ```bash
   # Verify alias exists
   alias | grep ai-  # (macOS/Linux)
   Get-Alias ai-*    # (Windows PowerShell)
   
   # If not found, check if config was sourced:
   source ~/.zshrc   # macOS
   source ~/.bashrc  # Linux
   . $PROFILE       # Windows PowerShell
   ```

3. **Node.js Issues**
   ```bash
   # Check Node.js installation
   node --version  # Should be >= 18
   
   # If not installed:
   brew install node    # macOS
   nvm install 18      # Linux/Windows
   ```

4. **Git Issues**
   ```bash
   # Check Git installation
   git --version
   
   # Configure Git if needed:
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   ```

## 🤖 Automatic Setup

Want to automate this setup? Run our setup script:

```bash
# macOS/Linux
./scripts/setup.sh

# Windows
.\scripts\setup.ps1
```

Or do it manually with npm:

```bash
# Install dependencies and setup environment
npm run setup
```

[Rest of the document remains the same...]