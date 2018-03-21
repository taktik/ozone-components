CreateTestDir  ()
{
    dir=$1
    moduleName=$2
    mkdir $D/test
    testFile=`find $dir -name "*test*" -type f`
    testFileName=`echo $testFile | cut -d/ -f 4`
    mv $testFile $D/test/${moduleName}_test.html
}

initProject(){
    dir=$1
    moduleName=$2
    pushd $dir
    echo '************'
    echo $PWD
    polymer init --name polymer-2-element
    npm init -y
    npm install typescript --save-dev
    rm -rf node_modules
    rm -rf bower_components
    popd

}

gitAdd(){
    dir=$1
    moduleName=$2
    pushd $dir
    echo '************'
    echo $PWD
    git add .
    git add test/
    popd

}

copyOtherConf()
{
    dir=$1
    moduleName=$2
    cp ../sample/* $dir
    cp ../sample/.travis.yml $dir
}

intallNpmDep()
{

    npm install --save gulp gulp-browserstack run-sequence https://github.com/marcelmeulemans/wct-junit-reporter.git web-component-tester
}
cd elements

#loop on each directories
for D in `find . -type d -maxdepth 2`
do
    if [[ $D =~ ^(.*)(taktik|ozone)(.*)(taktik|ozone) ]];
    then
        echo $D
        moduleName=`echo $D | cut -d/ -f 3`
        # CreateTestDir $D $moduleName
        # initProject $D $moduleName
        # copyOtherConf $D $moduleName
        # gitAdd  $D $moduleName
        copyOtherConf $D $moduleName
        # intallNpmDep $D $moduleName
      fi
done


# npm install --save https://github.com/marcelmeulemans/wct-junit-reporter.git gulp gulp-browserstack polymer-build  gulp-typescript merge2 run-sequence web-component-tester run-sequence

# bower install --save taktik/taktik-polymer-typescript taktik/ozone-api-search taktik/taktik-free-text-search paper-listbox  paper-input paper-item paper-button paper-material iron-icons iron-flex-layout iron-collapse
# bower install --save taktik/taktik-polymer-typescript paper-input taktik/ozone-edit-entry
#
# bower install --save taktik/taktik-polymer-typescript taktik/ozone-media-edit paper-item paper-button


###
cd ..
rm -rf lib-repo
mkdir lib-repo
cd lib-repo
git init --bare


##
cd ../../../
git subtree split --prefix=taktik_components/ozone-api-edit-video -b split-taktik_components/ozone-api-edit-video
git push ~/Workspace/temp/lib-repo split-taktik_components/ozone-api-edit-video:master


###
git remote add origin git@github.com:hubjac1/ozone-api-edit-video.git
git push origin refs/heads/master:master
