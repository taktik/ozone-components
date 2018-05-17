[![Build Status](https://travis-ci.org/taktik/ozone-search-helper.svg?branch=master)](https://travis-ci.org/taktik/ozone-search-helper)

# \<ozone-search-helper\>

Helper to build ozone-search query

## usage
```javaScript
  import {SearchQuery} from 'ozone-search-helper'

  let searchQuery = new SearchQuery();
  searchQuery.quicksearch('');
  const searchGenerator = ozoneItemApi.search(searchQuery);
  searchGenerator.next().then((results){
     console.log(results)
  });

```


## Install

```
$ npm install ozone-search-helper
```


