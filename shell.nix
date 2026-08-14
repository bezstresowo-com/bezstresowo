# run with: nix-shell <filename>.nix
let
  pkgs = import <nixpkgs> { };
in
pkgs.mkShell {
  # [rust]:
  # hardeningDisable = [ "all" ];
  # RUST_SRC_PATH = "${pkgs.rust.packages.stable.rustPlatform.rustLibSrc}";

  packages = with pkgs; [
    zsh

    # [python]:
    # (python3.withPackages (pp: [
    #   pp.pandas
    #   pp.requests
    #   pp.numpy
    # ]))

    # [node]:
    nodejs_24
    prisma-engines_6
    prisma_6

    # [golang]:
    # go

    # [rust]:
    # rustc
    # cargo
    # rustfmt
    # clippy
  ];

  shellHook = ''
    # [rust]:
    # export NIX_ENFORCE_PURITY=0

    # [node:prisma]:
    # Pin engine paths to prisma-engines_6 so they match prisma_6 in `packages`
    # (bare `prisma-engines` resolves to v7 in this nixpkgs).
    export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig"
    export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines_6}/bin/schema-engine"
    export PRISMA_QUERY_ENGINE_BINARY="${pkgs.prisma-engines_6}/bin/query-engine"
    export PRISMA_QUERY_ENGINE_LIBRARY="${pkgs.prisma-engines_6}/lib/libquery_engine.node"
    export PRISMA_FMT_BINARY="${pkgs.prisma-engines_6}/bin/prisma-fmt"

    # zsh terminal forwarding:
    export SHELL=${pkgs.zsh}/bin/zsh
    export ZDOTDIR="$(pwd)/.zshrc.d"
    mkdir -p "$ZDOTDIR"
    cat > "$ZDOTDIR/.zshrc" <<'EOF'
      # Source your original config
      [[ -f ~/.zshrc ]] && source ~/.zshrc

      # Prepend plain white (nix-shell) to the existing prompt
      PROMPT="%F{white}(nix-shell)%f $PROMPT"
    EOF
    exec ${pkgs.zsh}/bin/zsh
  '';
}
