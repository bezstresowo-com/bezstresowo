# run with: nix-shell shell.nix

let
  pkgs = import <nixpkgs> { };
in
pkgs.mkShell {
  packages = with pkgs; [
    zsh
    nodejs_24
  ];

  # for prisma-engines (6.7.0)
  env = with pkgs; {
    PRISMA_FORMAT_BINARY = "${prisma-engines}/bin/prisma-fmt";
    PRISMA_QUERY_ENGINE_BINARY = "${prisma-engines}/bin/query-engine";
    PRISMA_QUERY_ENGINE_LIBRARY = "${prisma-engines}/lib/libquery_engine.node";
    PRISMA_SCHEMA_ENGINE_BINARY = "${prisma-engines}/bin/schema-engine";
    PRISMA_INTROSPECTION_ENGINE_BINARY = "${prisma-engines}/bin/introspection-engine";
  };

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
