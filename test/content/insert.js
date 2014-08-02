var should = require('chai').should();

describe('Grasshopper core - content', function(){
    'use strict';

    var async = require('async'),
        path = require('path'),
        _ = require('lodash'),
        grasshopper = require('../../lib/grasshopper').init(require('../fixtures/config')),
        tokens = {},
        tokenRequests = [
            ['apitestuseradmin', 'TestPassword', 'globalAdminToken'],
            ['apitestuserreader', 'TestPassword', 'globalReaderToken'],
            ['apitestusereditor_restricted', 'TestPassword', 'restrictedEditorToken'],

            // There are no tests for the following:
            ['apitestusereditor', 'TestPassword', 'globalEditorToken'],
            ['apitestuserreader_1', 'TestPassword', 'nodeEditorToken']
        ],
        parallelTokenRequests = [];

    before(function(done){
        _.each(tokenRequests, function(theRequest) {
            parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
        });
        async.parallel(parallelTokenRequests, done);

    });

    describe('insert', function() {
        it('should return 401 because trying to access unauthenticated', function(done) {
            var obj = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    testfield: 'testvalue'
                }
            };

            grasshopper.request().content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return 403 because I am am only a reader of content.', function(done) {
            var obj = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    testfield: 'testvalue'
                }
            };

            grasshopper.request(tokens.globalReaderToken).content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should successfully insert content because I have the correct permissions.', function(done) {
            var obj = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue'
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.label.should.equal(obj.fields.label);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should successfully insert content and also convert strings that are valid native dates to a date object.',
            function(done) {
            var obj = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue',
                    testDateField: '2014-04-30T20:00:00.000Z',
                    testNested: {
                        dateField: '2014-04-30T20:00:00.000Z'
                    }
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.label.should.equal(obj.fields.label);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should successfully insert content and also convert multis that are strings ' +
                'that are valid native dates to a date object.',
            function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testvalue',
                        testDateField: '2014-04-30T20:00:00.000Z',
                        multi : [
                            {
                                testNested : {
                                    dateField : '2014-04-30T20:00:00.000Z'
                                }
                            }
                        ]
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        _.isDate(payload.fields.multi[0].testNested.dateField).should.equal(true);
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

        it('should successfully insert content and not convert booleans to a date object.', function(done) {
            var obj = {
                meta: {
                    type: '5254908d56c02c076e000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue',
                    testDateField: '2014-04-30T20:00:00.000Z',
                    testNested: {
                        dateField: '2014-04-30T20:00:00.000Z'
                    },
                    booleanfield : true
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.booleanfield.should.equal(true);
                    done();
                },
                function(err){
                    should.not.exist(err);
                    done();
                }
            ).done();
        });

        it('should successfully insert content and not convert strings that end in numbers to a date object.',
            function(done) {
                var obj = {
                    meta: {
                        type: '5254908d56c02c076e000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testvalue',
                        testDateField: '2014-04-30T20:00:00.000Z',
                        testNested: {
                            dateField: '2014-04-30T20:00:00.000Z'
                        },
                        stringnumfield : 'Step 2'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.stringnumfield.should.equal('Step 2');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

        it('should successfully insert content and not convert string numbers to a date object.', function(done) {
            var obj = {
                meta: {
                    type: '5254908d56c02c076e000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue',
                    testDateField: '2014-04-30T20:00:00.000Z',
                    testNested: {
                        dateField: '2014-04-30T20:00:00.000Z'
                    },
                    stringnumfield : '42'
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    payload.fields.stringnumfield.should.equal('42');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return 403 because I am trying to insert content in a node that is restricted to me.',
            function(done) {
            var obj = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue'
                }
            };

            grasshopper.request(tokens.restrictedEditorToken).content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(403);
                }
            ).done(done);
        });

        it('should return 400 because the content type we are using is invalid.', function(done) {
            var obj = {
                meta: {
                    type: '5320ed3fb9c9cb6364e23031',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                },
                fields: {
                    label: 'Generated title',
                    testfield: 'testvalue'
                }
            };

            grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(400);
                    err.message.should.equal('The content type referenced is invalid.');
                }
            ).done(done);
        });

        describe('Alpha field validation testing for alpha value between 5-10 chars.',function(){
            it('Should pass', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testvalue'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should throw 400 because alpha is too short.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'test'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Title" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because alpha includes a number.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest1'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Title" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });
        });

        describe('Content type converters', function(){
           it('should convert date types to date objects', function(done){
              var obj = {
                  "fields" : {
                      "a_date" : "2014/07/30",
                      "title" : "A Date"
                  },
                  "meta" : {
                      "node" : "53cece8de1c9ff0b00e6b4a3",
                      "type" : "53d15687ae9b9800003846e7",
                      "labelfield" : "title",
                      "typelabel" : "Test Date",
                      "created" : "2014-07-24T21:42:09.486Z",
                      "lastmodified" : "2014-07-24T21:42:09.486Z"
                  },
                  "__v" : 0
              } ;

               grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                   function(payload){
                       (payload.fields.a_date instanceof Date).should.be.ok;
                   },
                   function(err){
                       should.not.exist(err);
                   }
               ).done(done);

           });

            it('should convert datetime types to date objects', function(done){
                var obj = {
                    "fields" : {
                        "a_datetime" : "2014/07/09 5:00 pm",
                        "title" : "a datetime"
                    },
                    "meta" : {
                        "node" : "53cece8de1c9ff0b00e6b4a3",
                        "type" : "53d156e5ae9b9800003846e8",
                        "labelfield" : "title",
                        "typelabel" : "Test DateTime",
                        "created" : "2014-07-24T22:02:10.937Z",
                        "lastmodified" : "2014-07-24T22:02:10.937Z"
                    },
                    "__v" : 0
                } ;

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        (payload.fields.a_datetime instanceof Date).should.be.ok;
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);

            });

            it('should convert boolean types to boolean', function(done){
                var obj ={
                    "fields" : {
                        "test" : true,
                        "title" : "A Boolean"
                    },
                    "meta" : {
                        "node" : "53cece8de1c9ff0b00e6b4a3",
                        "type" : "53d18820ae9b9800003846ed",
                        "labelfield" : "title",
                        "typelabel" : "Test Boolean",
                        "created" : "2014-07-24T22:27:37.246Z",
                        "lastmodified" : "2014-07-24T22:27:37.246Z"
                    },
                    "__v" : 0
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        (typeof payload.fields.test == 'boolean').should.be.ok;
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);

            });

            it('should convert checkbox types to contain booleans', function(done){
                var obj ={
                    "__v" : 0,
                    "fields" : {
                        "booleancheckbox" : {
                            "hasFace" : false,
                            "hasLegs" : false,
                            "true" : true
                        },
                        "title" : "a checkbox"
                    },
                    "meta" : {
                        "node" : "53cece8de1c9ff0b00e6b4a3",
                        "type" : "53d155b4ae9b9800003846e6",
                        "labelfield" : "title",
                        "typelabel" : "Test Checkbox",
                        "created" : "2014-07-24T22:10:42.383Z",
                        "lastmodified" : "2014-07-24T22:27:14.661Z"
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        (typeof payload.fields.booleancheckbox.hasFace == 'boolean').should.be.ok;
                        (typeof payload.fields.booleancheckbox.hasLegs == 'boolean').should.be.ok;
                        (typeof payload.fields.booleancheckbox.true == 'boolean').should.be.ok;
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);

            });

            it('should convert editorial types to contain dates for validfrom and validto', function(done){
                var obj ={
                    "__v" : 0,
                    "fields" : {
                        "editorial" : {
                            "validTo" : "2014-07-31T20:50:00.000Z",
                            "validFrom" : "2014-07-01T20:50:00.000Z"
                        },
                        "title" : "Test Editorial"
                    },
                    "meta" : {
                        "node" : "53cece8de1c9ff0b00e6b4a3",
                        "type" : "53cece81e1c9ff0b00e6b4a2",
                        "labelfield" : "title",
                        "typelabel" : "Editorial",
                        "created" : "2014-07-22T20:50:41.496Z",
                        "lastmodified" : "2014-07-24T22:50:22.989Z"
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        (payload.fields.editorial.validTo instanceof Date).should.be.ok;
                        (payload.fields.editorial.validFrom instanceof Date).should.be.ok;
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);

            });
            
            it('should convert number types to be numbers', function(done){
               var obj= {
                   "fields" : {
                       "shouldbenumber" : "43.01",
                       "title" : "Test NUmber"
                   },
                   "meta" : {
                       "node" : "53cece8de1c9ff0b00e6b4a3",
                       "type" : "53d19248ae9b9800003846f0",
                       "labelfield" : "title",
                       "typelabel" : "Test Number",
                       "created" : "2014-07-24T23:10:54.080Z",
                       "lastmodified" : "2014-07-24T23:10:54.080Z"
                   },
                   "__v" : 0
               };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        (typeof payload.fields.shouldbenumber == "number").should.be.ok;
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);

            });

        });

        describe('Number field validation testing for number value between 0-10',function(){
            it('Should pass', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: 8
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should throw 400 because num is too low.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: 4
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj)
                    .then(function(payload){
                        should.not.exist(payload);
                    })
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    })
                    .done(done);
            });

            it('Should throw 400 because is not a number.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: 'string'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj)
                    .then(function(payload){
                        should.not.exist(payload);
                    })
                    .fail(function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    })
                    .done(done);
            });

            describe('without a min and max', function() {
                it('Should throw 200 even without a min or a max.', function(done) {
                    var obj = {
                        meta: {
                            type: '524362aa56c02c0703000001',
                            node : '526d5179966a883540000006',
                            labelfield: 'testfield'
                        },
                        fields: {
                            label: 'Generated title',
                            testfield: 'testtest',
                            numfield: "6",
                            coopersfield :"2"
                        }
                    };

                    grasshopper.request(tokens.globalEditorToken).content.insert(obj)
                        .then(function(payload){
                            payload.should.have.property('_id');
                            payload.fields.coopersfield.should.equal('2');
                        })
                        .fail(function(err){
                            should.not.exist(err);
                        })
                        .done(done);
                });
            });


            it('Should throw 400 because num is too high.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: 1000
                    }
                };
                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because number is a string.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: '1a'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because number is a string with a number in the string.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        numfield: '1'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"Num Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });
        });

        describe('AlphaNumeric field validation testing for length value between 5-10',function(){
            it('Should pass', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        alphanumfield: 'tes123est'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.label.should.equal('Generated title');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should throw 400 because alphanum is too short.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        alphanumfield: '123F'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"AlphaNum Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });

            it('Should throw 400 because alphanum is too long.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        alphanumfield: 'tes123fdsfafsdafdsafsdafasfdsaest'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                        err.message.should.equal(
                            '"AlphaNum Field" is not valid. Please check your validation rules and try again.');
                    }
                ).done(done);
            });
        });

        describe('Unique field validation testing',function(){
            it('Should pass', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        uniquefield1: 'test'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        payload.fields.uniquefield1.should.equal('test');
                    },
                    function(err){
                        should.not.exist(err);
                    }
                ).done(done);
            });

            it('Should fail because we just created a record that will conflict.', function(done) {
                var obj = {
                    meta: {
                        type: '524362aa56c02c0703000001',
                        node : '526d5179966a883540000006',
                        labelfield: 'testfield'
                    },
                    fields: {
                        label: 'Generated title',
                        testfield: 'testtest',
                        uniquefield1: 'test'
                    }
                };

                grasshopper.request(tokens.globalEditorToken).content.insert(obj).then(
                    function(payload){
                        should.not.exist(payload);
                    },
                    function(err){
                        err.code.should.equal(400);
                    }
                ).done(done);
            });
        });
    });

    function createGetToken(username, password, storage) {
        return {
            closure : function getToken(cb){
                grasshopper.auth('basic', { username: username, password: password }).then(function(token){
                    tokens[storage] = token;
                    cb();
                }).done();
            }
        };
    }
});