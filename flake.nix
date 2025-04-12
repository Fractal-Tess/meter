{
  description = "ESP8266 development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true; # Required for some ESP tools
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # ESP8266 tools
            esptool
            platformio

            # Python tools for ESP8266
            (python3.withPackages
              (ps: with ps; [ pyserial esptool platformio ]))

            # USB/UART tools for CP2102
            usbutils
            minicom
            screen
            picocom

            # Build tools
            gnumake
            cmake
            gcc
            gdb

            # Development tools
            git
            curl
            wget

            nodejs
            nodePackages.pnpm
          ];

          # Setup USB permissions for CP2102
          shellHook = ''
            echo "ESP8266 Development Environment"
            echo "------------------------------"
            echo "Note: You may need to add your user to the 'dialout' group"
            echo "to access the CP2102 USB-UART bridge:"
            echo "sudo usermod -a -G dialout $USER"

            # Check for CP2102
            if lsusb | grep -q "CP2102"; then
              echo "✓ CP2102 USB-UART bridge detected"
              
              # Try to identify the port
              PORT=$(ls /dev/ttyUSB* 2>/dev/null | head -n 1)
              if [ -n "$PORT" ]; then
                echo "✓ Serial port detected at $PORT"
              else
                echo "✗ No serial port detected. Is the device connected?"
              fi
            else
              echo "✗ CP2102 USB-UART bridge not detected"
            fi

            # Check PlatformIO installation
            if command -v pio >/dev/null 2>&1; then
              echo "✓ PlatformIO is available"
            else
              echo "First time setup: Run 'pio init' in your project directory"
            fi
          '';

          # Environment variables
          PLATFORMIO_CORE_DIR = "./.pio-core";
          PORT = "/dev/ttyUSB0"; # Default port for CP2102
        };
      });
}
