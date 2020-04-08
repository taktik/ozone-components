#/bin/bash
bucket_name=taktik-flowr-doc/ozone-components
version=`grep version lerna.json | sed -e 's/"version"://' | sed -e 's/"//g' | sed -e 's/[[:space:]]//g'`
cloud_path=$bucket_name/$version
gs_path=gs://$cloud_path
latest_path=gs://$bucket_name/latest

gsutil cp gs://$bucket_name/version_history.txt demo/version_history.txt
echo $version >> demo/version_history.txt
gsutil cp demo/version_history.txt gs://$bucket_name/version_history.txt

echo publish documentation for version: $version to $gs_path
gsutil -h "Cache-Control:no-cache,max-age=0" -m cp -r -J demo/* $gs_path
gsutil -h "Cache-Control:no-cache,max-age=0" -m cp -r -J demo/* $latest_path
echo Documentation avaliable at https://storage.googleapis.com/$cloud_path/index.html
echo Documentation avaliable at https://storage.googleapis.com/$bucket_name/latest/index.html
