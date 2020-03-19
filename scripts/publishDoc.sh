#/bin/bash
bucket_name=taktik-flowr-doc/ozone-components
version=`grep version lerna.json | sed -e 's/"version"://' | sed -e 's/"//g' | sed -e 's/[[:space:]]//g'`
cloud_path=$bucket_name/$version/demo
gs_path=gs://$cloud_path
echo publish documentation for version: $version to $gs_path
gsutil -m cp -r -J demo $gs_path
echo Documentation avaliable at https://storage.googleapis.com/$cloud_path/index.html
