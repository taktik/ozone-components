#/bin/bash
rm -rf demo/
mkdir demo
npx typedoc  --options typedoc.js
mkdir demo/tmp
find . -path "*docs-ressources*.*"  -exec cp {} demo/tmp \;
mv demo/tmp demo/doc/modules/docs-ressources
DEMO_PATH=packages/demo/ozone-components-demo/dist/
if [ -d "$DEMO_PATH" ]; then
    cp -r $DEMO_PATH demo
else
    echo "DEMO not included $DEMO_PATH does not exist"
    echo "try yarn run build before"
fi


