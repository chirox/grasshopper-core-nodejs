require('chai').should();
var request = require('supertest');

describe('api.contentTypes', function(){
    var url = url = require('./config/test').url,
        testContentTypeId  = "524362aa56c02c0703000001",
        readerToken = "",
        adminToken  = "",
        testCreatedContentTypeId = "",
        testCreatedContentTypeCustomVerb = "";

    before(function(done){

    });

    describe("GET: " + url + '/contentTypes/:id', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            true.should.equal(false);
            done();
        });

        it('should return an existing content type', function(done) {
            true.should.equal(false);
                        done();
        });
        it('should return 404 because test user id does not exist', function(done) {
            true.should.equal(false);
                        done();
        });
    });

    describe("GET: " + url + '/contentTypes', function() {
        it('should return a list of content types with the default page size', function(done) {
            true.should.equal(false);
                        done();
        });
        it('should a list of content types with the specified page size', function(done) {
            true.should.equal(false);
                        done();
        });

        it('should return an empty list if the page size and current requested items are out of bounds.', function(done) {
            true.should.equal(false);
                        done();
        });
        it('should return a 401 because user is not authenticated', function(done) {
            true.should.equal(false);
                        done();
        });
    });

    describe("POST: " + url + '/contentTypes', function() {
        /*@@ VERIFIED */
        it('should create a content type without an error using correct verb.', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testfield: {
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            true.should.equal(false);
                        done();
        });

        it('should create a content type without an error using correct verb. supplying fields and meta info', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testfield: {
                        id: "testfield",
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [{
                    id: "testfield",
                    required: true,
                    label: "Title",
                    instancing: 1,
                    type: "textbox"
                }],
                description: ""
            };
            true.should.equal(false);
                        done();
        });

        /*@@ VERIFIED */
        it('should return an error because we are missing a "label" field.', function(done){
            var newContentType = {
                fields: {
                    testid: {
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            true.should.equal(false);
                        done();
        });

        /*@@ VERIFIED */
        it('should return error if a content type id is sent with the request (maybe verb error).', function(done){
            var newContentType = {
                _id: "ISHOULDNOTBEHERE",
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };

            true.should.equal(false);
                        done();
        });

        /*@@ VERIFIED */
        it('should return error when a malformed field id is passed in (id has a space).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    "test id" :{
                        label: "This is a test label",
                        required: true,
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            true.should.equal(false);
                        done();
        });


        /*@@ VERIFIED */
        it('should return error when a malformed field is passed in (missing label).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        required: true,
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
           true.should.equal(false);
                       done();
        });

        /*@@ VERIFIED */
        it('should return error when a malformed field is passed in (missing type).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        label: "Test Field Label",
                        required: true,
                        instancing: 1
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            true.should.equal(false);
                        done();
        });

        /*@@ VERIFIED */
        it('should return error when a malformed field is passed in (invalid type).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        label: "Test Field Label",
                        type: "I DONT EXIST",
                        required: true,
                        instancing: 1
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
            true.should.equal(false);
                        done();
        });

        /*@@ VERIFIED */
        it('should return error when a malformed meta id is passed in (id has a space).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        label: "This is a test label",
                        required: true,
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: {
                    "testmeta id" : {
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                },
                description: ""
            };
            true.should.equal(false);
                        done();
        });


        /*@@ VERIFIED */
        it('should return error when a malformed meta is passed in (missing label).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        label: "My Label",
                        required: true,
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: {
                    testmetaid: {
                    id: "testmetaid",
                    type: "I DO NOT EXIST",
                    required: true,
                    instancing: 1
                }},
                description: ""
            };
            true.should.equal(false);
                        done();
        });

        /*@@ VERIFIED */
        it('should return error when a malformed meta is passed in (missing type).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        label: "Test Field Label",
                        required: true,
                        type: "textbox",
                        instancing: 1
                    }
                },
                helpText: "",
                meta: {testmetaid: {
                    label: "Test Field Label",
                    required: true,
                    instancing: 1
                }},
                description: ""
            };
            true.should.equal(false);
                        done();
        });

        /*@@ VERIFIED */
        it('should return error when a malformed meta is passed in (invalid type).', function(done){
            var newContentType = {
                label: "newtestsuitecontent",
                fields: {
                    testid: {
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                },
                helpText: "",
                meta: {testmetaid:{
                    label: "Test Field Label",
                    type: "I DO NOT EXIST",
                    required: true,
                    instancing: 1
                }},
                description: ""
            };
            true.should.equal(false);
                        done();
        });
    });

    describe("PUT: " + url + '/contentTypes', function() {
        it('should return a 403 because user does not have permissions to access users', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: "updatedlabel",
                fields: {
                    testfield: {
                        required: true,
                        label: "Title",
                        instancing: 1,
                        type: "textbox"
                    }
                },
                helpText: "",
                meta: [],
                description: ""
            };
true.should.equal(false);
            done();
        });
        it('should update a content type using the correct verb', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeId,
                label: "updatedlabel",
                fields: {
                    testid : {
                        id: "testid",
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                },
                helpText: "",
                meta: {testmetaid:{
                    label: "Test Field Label",
                    type: "textbox",
                    required: true,
                    instancing: 1
                }},
                description: ""
            };

            true.should.equal(false);
                        done();
        });

        it('should update a content type using the method override', function(done) {
            var newContentType = {
                _id: testCreatedContentTypeCustomVerb,
                label: "updatedlabel custom verb",
                    fields: {
                        testid : {
                            id: "testid",
                            label: "Test Field Label",
                            type: "textbox",
                            required: true,
                            instancing: 1
                        }
                },
                helpText: "",
                meta: {testmetaid:{
                    label: "Test Field Label",
                    type: "textbox",
                    required: true,
                    instancing: 1
                }},
                description: ""
            };

            true.should.equal(false);
                        done();
        });

        it('should return error if content type is updated without a set "ID"', function(done){
            var newContentType = {
                label: "updatedlabel",
                fields: {
                    testid : {
                        id: "testid",
                        label: "Test Field Label",
                        type: "textbox",
                        required: true,
                        instancing: 1
                    }
                },
                helpText: "",
                meta: {testmetaid:{
                    label: "Test Field Label",
                    type: "textbox",
                    required: true,
                    instancing: 1
                }},
                description: ""
            };

            true.should.equal(false);
                        done();
        });

    });

    describe("DELETE: " + url + '/contentTypes', function() {
        it('should return a 403 because user does not have permissions to access content types', function(done) {
            true.should.equal(false);
                        done();
        });
        it('should delete a content type using the correct verb', function(done) {
            true.should.equal(false);
                        done();
        });
        it('should delete a content type using the method override', function(done) {
            true.should.equal(false);
                        done();
        });

        it('should return 200 when we try to delete a content type that doesn\'t exist', function(done) {
            true.should.equal(false);
                        done();
        });
    });
});