with import <nixpkgs> { };
let
  mypython = (python3.withPackages (ps: with python3Packages; [
    z3
    bootstrapped-pip
    slither-analyzer
    virtualenvwrapper
    pip
  ]));
in
mkShell {
  buildInputs = [
    stdenv
    nodejs
    yarn
    yarn2nix
    nodePackages.typescript
    python3Packages.bootstrapped-pip
    deno
  ];
  nativeBuildInputs = [
    mypython
  ];
  shellHook = ''
    export PIP_PREFIX=$(pwd)/_build/pip_packages
    export PYTHONPATH="$PIP_PREFIX:${mypython.sitePackages}:${mypython}/${mypython.sitePackages}"
    unset SOURCE_DATE_EPOCH
    PATH="$PWD/node_modules/.bin/:$HOME/.cargo/bin:$PIP_PREFIX/bin:$PATH"
    set -a
    source .env
    set +a
  '';
}
