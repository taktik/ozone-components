#/bin/bash
rm -rf doc/
npx typedoc  --options typedoc.js
mkdir doc/tmp
find . -path "*docs-ressources*.*"  -exec cp {} doc/tmp \;
mv doc/tmp doc/modules/docs-ressources
