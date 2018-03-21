#!/bin/bash

##################
#
# This script distribute the project,
#
##################

echo "Default Bootstrap action"
npm install
bower install --allow-root

gulp clean

gulp ts

gulp dist


# install with package manager
bower install --save taktik/ozone-login#webpack  taktik/ozone-logout#webpack
npm install --save ozone-api-authentication

//import in you TS files
import 'ozone-login/ozone-login.html'
import 'ozone-logout/ozone-logout.html'


Declare in your HTML
<ozone-login> </ozone-login>
<ozone-logout> </ozone-logout>