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
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # ESP8266 toolchain
            esp8266-rtos-sdk
            esptool

            # Python tools for ESP8266
            (python3.withPackages (ps: with ps; [
              pyserial
              esptool
            ]))

            # USB/UART tools for CP2102
            usbutils
            minicom
            screen

            # Build tools
            gnumake
            cmake
            gcc

            # Development tools
            git
            platformio
          ];

          # Setup USB permissions for CP2102
          shellHook = ''
            echo "ESP8266 Development Environment"
            echo "------------------------------"
            echo "Note: You may need to add your user to the 'dialout' group"
            echo "to access the CP2102 USB-UART bridge:"
            echo "sudo usermod -a -G dialout $USER"
            
            # Ensure the CP2102 device is detected
            if lsusb | grep -q "CP2102"; then
              echo "CP2102 USB-UART bridge detected"
            else
              echo "Warning: CP2102 USB-UART bridge not detected"
            fi
          '';

          # Environment variables
          ESPHOME_REGION = "us"; # Set your region
          PORT = "/dev/ttyUSB0"; # Default port for CP2102
        };
      }
    );
}
