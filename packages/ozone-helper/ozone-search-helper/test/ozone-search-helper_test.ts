import {SearchGenerator, SearchQuery} from '../src/ozone-search-helper'
import {expect} from 'chai'
import {TermsAggregation, SearchRequest} from "ozone-type";
describe('ozone-search-helper', function() {

    it('SearchQuery is exposed as a global class', function() {
        const mySearchQuery = new SearchQuery();
        expect(mySearchQuery).to.be.an.instanceof(SearchQuery);
    });

    it('SearchGenerator is exposed as a global class', function() {
        const mySearchQuery = new SearchQuery();
        const mySearchGenerator = new SearchGenerator('url', mySearchQuery);
        expect(mySearchGenerator).to.be.an.instanceof(SearchGenerator);
    });

    it('SearchGenerator quicksearch', function() {
        const searchQuery = new SearchQuery();
        searchQuery.quicksearch('search value');
        expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
            size: 10,
            query: {
                "$type": "QueryStringQuery",
                "field": "_quicksearch",
                "queryString": 'search value*'
            }
        })
    });

    it('SearchGenerator suggestion', function() {
        const searchQuery = new SearchQuery();
        searchQuery.suggestion('search value', 'new');
        expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
            size: 10,
            query: {
                "$type": "QueryStringQuery",
                "field": "_quicksearch",
                "queryString": 'search value*'
            },
            aggregations: [{
                "$type": "TermsAggregation",
                name: "suggest",
                field: "_quicksearch",
                order: "COUNT_DESC",
                size: 10,
                includePattern: 'new.*'
            }]
        })
    });

    it('SearchGenerator custom', ()=>{
        const searchQuery = new SearchQuery();
        searchQuery.custom({size : 8} as SearchRequest)
        expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({size: 8})
    });

    it('SearchGenerator termQuery', ()=>{
        const searchQuery = new SearchQuery();
        searchQuery.termQuery('myField', 'aText')
        expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
            size: 10,
            query: {
                $type: "TermQuery",
                field: "myField",
                value: 'aText'
            }
        })
    });
    it('SearchGenerator typeQuery', ()=>{
        const searchQuery = new SearchQuery();
        searchQuery.typeQuery(...['type1', 'type2'])
        expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
            size: 10,
            query: {
                $type: "TypeQuery",
                typeIdentifiers: ['type1', 'type2'],
                includeSubTypes: false
            }
        })
    });
    it('SearchGenerator typeQueryWithSubType', ()=>{
        const searchQuery = new SearchQuery();
        searchQuery.typeQueryWithSubType(...['type1', 'type2'])
        expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
            size: 10,
            query: {
                $type: "TypeQuery",
                typeIdentifiers: ['type1', 'type2'],
                includeSubTypes: true
            }
        })
    });

    describe('SearchGenerator should combine queries', ()=>{
        it('typeQuery and TermQuery', ()=> {
            const searchQuery = new SearchQuery();
            searchQuery.typeQuery('aType').and.quicksearch('hello');

            expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
                size: 10,
                query: {
                    "$type": "BoolQuery",
                    mustClauses: [
                        {
                            "$type": "TypeQuery",
                            typeIdentifiers: ['aType'],
                            includeSubTypes: false
                        },
                        {
                            "$type": "QueryStringQuery",
                            "field": "_quicksearch",
                            "queryString": 'hello*'
                        }
                    ]
                }
            })

        })

        it('TypeQuery or quicksearch', ()=> {
            const searchQuery = new SearchQuery();
            searchQuery.typeQuery('aType').or.quicksearch('hello');

            expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
                size: 10,
                query: {
                    "$type": "BoolQuery",
                    shouldClauses: [
                        {
                            "$type": "TypeQuery",
                            typeIdentifiers: ['aType'],
                            includeSubTypes: false
                        },
                        {
                            "$type": "QueryStringQuery",
                            "field": "_quicksearch",
                            "queryString": 'hello*'
                        }
                    ]
                }
            })

        })

        it('(typeQuery or quicksearch) and termQuery', ()=> {
            const searchQuery = new SearchQuery();
            searchQuery.typeQuery('aType')
                .or.quicksearch('hello')
                .and.termQuery('myField','aText');

            expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
                size: 10,
                query: {
                    "$type": "BoolQuery",
                    mustClauses: [
                        {
                            "$type": "BoolQuery",
                            shouldClauses: [
                                {
                                    "$type": "TypeQuery",
                                    typeIdentifiers: ['aType'],
                                    includeSubTypes: false
                                },
                                {
                                    "$type": "QueryStringQuery",
                                    "field": "_quicksearch",
                                    "queryString": 'hello*'
                                }
                            ]
                        },
                        {
                            $type: "TermQuery",
                            field: "myField",
                            value: 'aText'
                        }
                    ]
                }
            })
        });

        it('(typeQuery or quicksearch or termQuery)', ()=> {
            const searchQuery = new SearchQuery();
            searchQuery.typeQuery('aType')
                .or.quicksearch('hello')
                .termQuery('myField','aText');

            expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
                size: 10,
                query: {
                    "$type": "BoolQuery",
                    shouldClauses: [
                        {
                            "$type": "TypeQuery",
                            typeIdentifiers: ['aType'],
                            includeSubTypes: false
                        },
                        {
                            "$type": "QueryStringQuery",
                            "field": "_quicksearch",
                            "queryString": 'hello*'
                        },
                        {
                            $type: "TermQuery",
                            field: "myField",
                            value: 'aText'
                        }
                    ]
                }
            })
        });
    })
    describe('should order', ()=>{
        it('search and order ascending', ()=>{
            const searchQuery = new SearchQuery();
            searchQuery.termQuery('myField', 'aText').order('aField').ASC;
            expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
                size: 10,
                query: {
                    $type: "TermQuery",
                    field: "myField",
                    value: 'aText'
                },
                sorts:[
                    {
                        field: 'aField',
                        order: 'ASC'
                    }
                ]
            })
        })
        it('order ascending and search', ()=>{
            const searchQuery = new SearchQuery();
            searchQuery.order('aField').ASC.termQuery('myField', 'aText');
            expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
                size: 10,
                query: {
                    $type: "TermQuery",
                    field: "myField",
                    value: 'aText'
                },
                sorts:[
                    {
                        field: 'aField',
                        order: 'ASC'
                    }
                ]
            })
        })
        it('order descending', ()=>{
            const searchQuery = new SearchQuery();
            searchQuery.order('aField').DESC.termQuery('myField', 'aText');
            expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
                size: 10,
                query: {
                    $type: "TermQuery",
                    field: "myField",
                    value: 'aText'
                },
                sorts:[
                    {
                        field: 'aField',
                        order: 'DESC'
                    }
                ]
            })
        })
        it('compose order', ()=>{
            const searchQuery = new SearchQuery();
            searchQuery.order('aField').ASC.termQuery('myField', 'aText')
                .order('bField').DESC
                .order('cField').NONE;
            expect(JSON.parse(searchQuery.searchQuery)).to.be.deep.equal({
                size: 10,
                query: {
                    $type: "TermQuery",
                    field: "myField",
                    value: 'aText'
                },
                sorts:[
                    {
                        field: 'aField',
                        order: 'ASC'
                    },
                    {
                        field: 'bField',
                        order: 'DESC'
                    },
                    {
                        field: 'cField',
                        order: 'NONE'
                    }
                ]
            })
        })
    })
})
