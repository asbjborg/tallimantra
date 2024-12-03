# PowerShell setup script for Tallimantra

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Purple = "`e[35m"
$Cyan = "`e[36m"
$Reset = "`e[0m"

# ASCII Art
Write-Host "$Cyan"
@"
 _____     _ _ _                      _             
|_   _|_ _| | (_)_ __  __ _ _ _  ___| |_ _ _ __ _  
  | |/ _` | | | | '  \/ _` | ' \/ -_)  _| '_/ _` | 
  |_|\__,_|_|_|_|_|_|_\__,_|_||_\___|\__|_| \__,_| 
                                                    
"@ | Write-Host
Write-Host "$Reset"

# Random dev jokes
$jokes = @(
    "Why do programmers prefer dark mode? Because light attracts bugs! 🪲",
    "Why did the developer go broke? Because he used up all his cache! 💸",
    "What's a programmer's favorite hangout spot? Foo Bar! 🍻",
    "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25! 🎃",
    "Why did the functional programmer get thrown out of school? Because they refused to take classes! 🎓",
    "What's a programmer's favorite place in the house? The REST room! 🚽",
    "Why do programmers hate nature? It has too many bugs! 🌳",
    "What did the programmer say to the rubber duck? You're the only one who understands me! 🦆"
)

Write-Host "$Green`🚀 Setting up Tallimantra development environment...$Reset`n"

# Check Node.js installation
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "$Red`❌ Node.js is not installed$Reset"
    Write-Host "$Yellow`Please install Node.js (version >= 18) from https://nodejs.org$Reset"
    exit 1
}

# Check npm installation
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "$Red`❌ npm is not installed$Reset"
    Write-Host "$Yellow`Please install npm$Reset"
    exit 1
}

# Install dependencies
Write-Host "$Green`📦 Installing dependencies...$Reset"
npm install

# Create PowerShell profile if it doesn't exist
if (!(Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -Type File -Force
}

# Add environment variables if they don't exist
$setupContent = @"

# Tallimantra Environment Setup
`$env:TALLIMANTRA_ROOT = '$PWD'
function ai-setup { cat `$env:TALLIMANTRA_ROOT\docs\guides\ai-chat-setup.md }
function ai-context { node `$env:TALLIMANTRA_ROOT\scripts\get-context.js }
"@

if (!(Select-String -Path $PROFILE -Pattern "TALLIMANTRA_ROOT" -Quiet)) {
    Add-Content -Path $PROFILE -Value $setupContent
}

Write-Host "`n$Green`✅ Setup complete!$Reset"
Write-Host "$Yellow`Please run: . `$PROFILE$Reset"

# Print random joke
$randomJoke = $jokes | Get-Random
Write-Host "`n$Purple`💡 Random dev joke:$Reset"
Write-Host "$Cyan`$randomJoke$Reset`n"