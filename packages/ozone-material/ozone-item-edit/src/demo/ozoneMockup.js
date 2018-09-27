
function setup(app){
    app.get('/rest/v3/type/media', function(req, res) {
        res.json({
            "identifier": "media",
            "name": {
                "strings": {
                    "en": "Legacy Media Type",
                    "fr": "Legacy Media Type",
                    "nl": "Legacy Media Type"
                }
            },
            "isUnsearchable": false,
            "isAbstract": false,
            "isEmbedOnly": false,
            "superType": "item",
            "traits": [
                "tags.custom",
                "flowr.media",
                "restricted.content"
            ],
            "fields": [
                {
                    "identifier": "date",
                    "fieldType": "date",
                    "name": {
                        "strings": {
                            "en": "IPTC Date"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "country",
                    "fieldType": "string",
                    "name": {
                        "strings": {
                            "en": "IPTC Country"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "keywords",
                    "fieldType": "set<string>",
                    "name": {
                        "strings": {
                            "en": "Keywords",
                            "fr": "Mots-clés",
                            "nl": "Trefwoorden"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": true,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "city",
                    "fieldType": "string",
                    "name": {
                        "strings": {
                            "en": "IPTC City"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "fileUTI",
                    "fieldType": "set<string>",
                    "fieldComputer": "uti",
                    "name": {
                        "strings": {
                            "en": "UTI"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "fullText",
                    "fieldType": "blob",
                    "name": {
                        "strings": {
                            "en": "Text"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "caption",
                    "fieldType": "analyzed_string",
                    "name": {
                        "strings": {
                            "en": "Caption"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "representedBy",
                    "fieldType": "ref<media>",
                    "name": {
                        "strings": {
                            "en": "Represented by"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "source",
                    "fieldType": "analyzed_string",
                    "name": {
                        "strings": {
                            "en": "Source"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "title",
                    "fieldType": "analyzed_string",
                    "name": {
                        "strings": {
                            "en": "Title"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": true,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "stocks",
                    "fieldType": "set<ref<stock>>",
                    "name": {
                        "strings": {
                            "en": "Stocks"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "parentFolder",
                    "fieldType": "ref<folder>",
                    "name": {
                        "strings": {
                            "en": "Parent"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "file",
                    "fieldType": "ref<file>",
                    "name": {
                        "strings": {
                            "en": "File"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "previewDate",
                    "fieldType": "date",
                    "name": {
                        "strings": {
                            "en": "Preview Date"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "collections",
                    "fieldType": "set<ref<collection>>",
                    "name": {
                        "strings": {
                            "en": "Collections"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "credit",
                    "fieldType": "analyzed_string",
                    "name": {
                        "strings": {
                            "en": "IPTC Credit"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "height",
                    "fieldType": "integer",
                    "name": {
                        "strings": {
                            "en": "Height"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "indexed_fulltext",
                    "fieldType": "analyzed_string",
                    "fieldComputer": "fulltext",
                    "name": {
                        "strings": {
                            "en": "Indexed fulltext"
                        }
                    },
                    "indexed": true,
                    "stored": false,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": true,
                    "inQuickSearch": true,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "byLine",
                    "fieldType": "analyzed_string",
                    "name": {
                        "strings": {
                            "en": "IPTC ByLine"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "previewRatio",
                    "fieldType": "float",
                    "name": {
                        "strings": {
                            "en": "Preview ratio"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "length",
                    "fieldType": "integer",
                    "name": {
                        "strings": {
                            "en": "Length"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "creationDate",
                    "fieldType": "date",
                    "name": {
                        "strings": {
                            "en": "Creation Date"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "derivedFiles",
                    "fieldType": "set<ref<file>>",
                    "name": {
                        "strings": {
                            "en": "Derived files"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "modificationDate",
                    "fieldType": "date",
                    "name": {
                        "strings": {
                            "en": "Modification Date"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "specialInstructions",
                    "fieldType": "analyzed_string",
                    "name": {
                        "strings": {
                            "en": "IPTC Special instructions"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "width",
                    "fieldType": "integer",
                    "name": {
                        "strings": {
                            "en": "Width"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "objectName",
                    "fieldType": "string",
                    "name": {
                        "strings": {
                            "en": "IPTC ObjectName"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "category",
                    "fieldType": "string",
                    "name": {
                        "strings": {
                            "en": "IPTC Category"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "publications",
                    "fieldType": "set<publication>",
                    "name": {
                        "strings": {
                            "en": "Publications"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "status",
                    "fieldType": "enum<org.taktik.defiris.constants.Medias$Status>",
                    "name": {
                        "strings": {
                            "en": "Status"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                }
            ]
        });
    });
    app.get('/rest/v3/type/item', function(req, res) {
        res.json({
            "identifier": "item",
            "name": {
                "strings": {
                    "en": "Item",
                    "fr": "Item",
                    "nl": "Item"
                }
            },
            "isUnsearchable": false,
            "isAbstract": false,
            "isEmbedOnly": false,
            "traits": [],
            "fields": [
                {
                    "identifier": "deleted",
                    "fieldType": "boolean",
                    "name": {
                        "strings": {
                            "en": "Deleted"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "defaultValue": false,
                    "constraints": []
                },
                {
                    "identifier": "creationUser",
                    "fieldType": "user",
                    "name": {
                        "strings": {
                            "en": "Creation user"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "organization",
                    "fieldType": "integer",
                    "name": {
                        "strings": {
                            "en": "Organization"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "modificationUser",
                    "fieldType": "user",
                    "name": {
                        "strings": {
                            "en": "Modification user"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "name",
                    "fieldType": "string",
                    "name": {
                        "strings": {
                            "en": "Name"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": true,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "typeHierarchy",
                    "fieldType": "set<string>",
                    "fieldComputer": "typeHierarchy",
                    "name": {
                        "strings": {
                            "en": "Type hierarchy"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": true,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                },
                {
                    "identifier": "tenant",
                    "fieldType": "uuid",
                    "name": {
                        "strings": {
                            "en": "Tenant"
                        }
                    },
                    "indexed": true,
                    "stored": true,
                    "readOnly": false,
                    "deprecated": false,
                    "serverSide": false,
                    "inQuickSearch": false,
                    "overridable": false,
                    "constraints": []
                }
            ]
        });
    });
}

module.exports = setup;