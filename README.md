# ESP8266 Development Environment

A complete ESP8266 development environment using Nix flakes and direnv for reproducible development.

## 🚀 Quick Start

1. **Install Nix** (if not already installed):
   ```bash
   sh <(curl -L https://nixos.org/nix/install) --no-daemon
   ```

2. **Enable Nix in your shell**:
   ```bash
   source ~/.nix-profile/etc/profile.d/nix.sh
   ```

3. **Enable flakes** (one-time setup):
   ```bash
   mkdir -p ~/.config/nix
   echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
   ```

4. **Install direnv**:
   ```bash
   nix profile add nixpkgs#direnv
   ```

5. **Set up shell integration** (add to your `~/.zshrc`):
   ```bash
   echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
   ```

6. **Run the setup script**:
   ```bash
   ./setup.sh
   ```

## 🛠️ What's Included

This development environment provides:

### ESP8266 Development Tools
- **PlatformIO** - Complete IoT development framework
- **esptool** - ESP8266 flashing and debugging tool
- **CP2102 USB-UART bridge support** - For connecting ESP8266 devices

### Development Tools
- **Clang 19** - Modern C/C++ compiler with full toolchain
- **Node.js** - JavaScript runtime for web development
- **pnpm** - Fast package manager for Node.js
- **Python 3** - With ESP8266 development packages

### Serial Communication
- **minicom** - Serial terminal for device communication
- **screen** - Alternative serial terminal
- **picocom** - Lightweight serial terminal
- **usbutils** - USB device utilities

## 🔧 Usage

### Automatic Environment Activation
The environment automatically activates when you enter the project directory thanks to direnv. You'll see a message indicating the environment is loaded.

### Manual Environment Activation
If you need to manually enter the development environment:
```bash
nix develop
```

### Starting a New Project
1. Initialize a new PlatformIO project:
   ```bash
   pio init --board esp8266
   ```

2. Build your project:
   ```bash
   pio run
   ```

3. Upload to your ESP8266:
   ```bash
   pio run --target upload
   ```

4. Monitor serial output:
   ```bash
   pio device monitor
   ```

## 🔌 Hardware Setup

### USB Permissions
To access the CP2102 USB-UART bridge, your user needs to be in the `dialout` group:
```bash
sudo usermod -a -G dialout $USER
```
**Note**: You'll need to log out and back in for this to take effect.

### Device Detection
The environment automatically checks for connected ESP8266 devices and provides helpful feedback about:
- CP2102 USB-UART bridge detection
- Available serial ports
- PlatformIO availability

## 📁 Project Structure

```
.
├── flake.nix          # Nix flake configuration
├── .envrc             # direnv configuration
├── setup.sh           # Setup script
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## 🎯 Available Commands

Once the environment is active, you have access to:

- `pio` - PlatformIO CLI
- `esptool` - ESP8266 flashing tool
- `clang` - C/C++ compiler
- `node` - Node.js runtime
- `pnpm` - Package manager
- `minicom` - Serial terminal
- `screen` - Serial terminal alternative
- `picocom` - Lightweight serial terminal

## 🔄 Environment Updates

To update the development environment:
```bash
nix flake update
nix develop
```

## 🐛 Troubleshooting

### Nix not found
```bash
source ~/.nix-profile/etc/profile.d/nix.sh
```

### direnv not working
Make sure you've added the hook to your shell configuration and restarted your terminal.

### USB device not detected
1. Check if your user is in the `dialout` group
2. Try reconnecting the device
3. Check `lsusb` for device detection

### PlatformIO issues
1. Run `pio init` to initialize the project
2. Check the PlatformIO documentation for your specific board

## 📚 Resources

- [PlatformIO Documentation](https://docs.platformio.org/)
- [ESP8266 Arduino Core](https://github.com/esp8266/Arduino)
- [Nix Flakes](https://nixos.wiki/wiki/Flakes)
- [direnv](https://direnv.net/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
