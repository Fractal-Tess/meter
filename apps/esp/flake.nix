{
  description = "ESP8266 development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs = { self, systems, nixpkgs, ... }:
    let
      clangVersion = 19; # Change this to update the whole stack
      overlays = [
        (final: prev: {
          llvm = prev."llvmPackages_${toString clangVersion}";
          clang = prev."clang_${toString clangVersion}";
        })
      ];
      eachSystem = f:
        nixpkgs.lib.genAttrs (import systems) (system:
          f (import nixpkgs {
            inherit overlays system;
            config.allowUnfree = true; # Required for some ESP tools
          }));
    in {
      devShells = eachSystem (pkgs: {
        default = pkgs.mkShell {
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

            # Clang tools
            clang
            llvm.lldb
            clang-tools
            llvm.libstdcxxClang
            llvm.libcxx
          ];

          shellHook = ''
            echo "
                 ______
                / ____/
               / /     
              / /___   
              \____/   

              ESP8266 Development Environment
              clang version: $(${pkgs.clang}/bin/clang --version | head -n 1)
            " | ${pkgs.lolcat}/bin/lolcat;

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
    };
}
