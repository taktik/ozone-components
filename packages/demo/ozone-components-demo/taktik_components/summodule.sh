
## add submodule


git submodule add git@github.com:/taktik/ozone-edit-entry
git submodule add git@github.com:/taktik/ozone-edit-panel ***DELETED***
git submodule add git@github.com:/taktik/ozone-edit-text-entry
git submodule add git@github.com:/taktik/ozone-item-abstract-view
git submodule add git@github.com:/taktik/ozone-localized-string
git submodule add git@github.com:/taktik/ozone-logout
git submodule add git@github.com:/taktik/ozone-mosaic
git submodule add git@github.com:/taktik/ozone-edit-number-entry
git submodule add git@github.com:/taktik/ozone-edit-set-entry
git submodule add git@github.com:/taktik/ozone-free-text-search
git submodule add git@github.com:/taktik/ozone-item-preview
git submodule add git@github.com:/taktik/ozone-login
git submodule add git@github.com:/taktik/ozone-media-edit
git submodule add git@github.com:/taktik/ozone-upload
git submodule add git@github.com:/taktik/ozone-api-authentication
git submodule add git@github.com:/taktik/ozone-api-behaviors
git submodule add git@github.com:/taktik/ozone-api-item
git submodule add git@github.com:/taktik/ozone-api-login
git submodule add git@github.com:/taktik/ozone-api-logout
git submodule add git@github.com:/taktik/ozone-api-search
git submodule add git@github.com:/taktik/ozone-api-type
git submodule add git@github.com:/taktik/ozone-api-upload
git submodule add git@github.com:/taktik/ozone-config
git submodule add git@github.com:/taktik/ozone-collection
git submodule add git@github.com:/taktik/ozone-media-url
git submodule add git@github.com:/taktik/ozone-search-helper
git submodule add git@github.com:/taktik/taktik-clappr-wrapper   ***DELETED***
git submodule add git@github.com:/taktik/taktik-search-api-mixin
git submodule add git@github.com:/taktik/taktik-free-text-search
git submodule add git@github.com:/taktik/taktik-language-selection  ***DELETED***
git submodule add git@github.com:/taktik/ozone-video-player
git submodule add git@github.com:/taktik/ozone-edit-number-entry

git submodule foreach 'git checkout -b webpack'
git submodule foreach 'git commit --allow-empty -a -m"1st release of subtitles"'
git submodule foreach 'git stash'

git submodule foreach 'git push origin webpack:webpack'
cd taktik_components/ozone-api-item
git commit -a -m'demo with marker plugin'
cd ../ozone-api-login
git commit -a -m'demo with marker plugin'
cd ../ozone-api-logout
git commit -a -m'demo with marker plugin'
cd ../ozone-api-search
git commit -a -m'demo with marker plugin'
cd ../ozone-api-type
git commit -a -m'demo with marker plugin'
cd ../ozone-api-upload
git commit -a -m'demo with marker plugin'
cd ../ozone-collection
git commit -a -m'demo with marker plugin'
cd ../taktik-polymer-typescript