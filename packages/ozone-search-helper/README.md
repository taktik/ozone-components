# \<ozone-search-helper\>

Helper to build ozone-search query

## usage
```javaScript
  import {SearchQuery, SearchGenerator} from 'ozone-search-helper'

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


