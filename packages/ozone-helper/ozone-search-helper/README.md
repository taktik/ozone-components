[![NPM version][npm-image]][npm-url]
# ozone-search-helper

Helper to build ozone-search query

## usage

```javaScript
  let searchQuery = new SearchQuery();
  searchQuery.quicksearch('');
  const searchGenerator = itemClient.search(searchQuery.searchRequest);
```

Search query can be chained.
Example:
```javaScript
  let searchQuery = new SearchQuery();
  // ((type == 'aType' or contains 'hello') and 'myField' == 'aText)
  // Order by 'creationDate'
  searchQuery
     .typeQuery('aType')
     .or.quicksearch('hello')
     .and.termQuery('myField','aText')
     .order('creationDate').DESC;

  searchQuery.quicksearch('').and;

  const searchGenerator = itemClient.search(searchQuery.searchRequest);
```

Example:
```javaScript
  let searchQuery = new SearchQuery();
  // type == 'aType' or contains 'hello' or 'myField' == 'aText'
  searchQuery
     .typeQuery('aType')
     .or
     .quicksearch('hello')
     .termQuery('myField','aText')

  const searchGenerator = itemClient.search(searchQuery.searchRequest);
```


## Install

```
$ npm install ozone-search-helper
```



[npm-image]: https://badge.fury.io/js/ozone-search-helper.svg
[npm-url]: https://npmjs.org/package/ozone-search-helper
