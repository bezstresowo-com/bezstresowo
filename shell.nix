# run with: nix-shell shell.nix

let
  pkgs = import <nixpkgs> { };
in
pkgs.mkShell {
  packages = with pkgs; [
    zsh
    nodejs_24
  ];

  shellHook = ''
    export SHELL=${pkgs.zsh}/bin/zsh
    export ZDOTDIR=$(pwd)/.zshrc.d
    mkdir -p $ZDOTDIR
    cat > $ZDOTDIR/.zshrc <<'EOF'
      # Source your original config
      [[ -f ~/.zshrc ]] && source ~/.zshrc

      # Prepend plain white (nix-shell) to the existing prompt
      PROMPT="%F{white}(nix-shell)%f $PROMPT"
    EOF
    exec ${pkgs.zsh}/bin/zsh
  '';
}
