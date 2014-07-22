var should = require('chai').should();

describe('Grasshopper core - content', function(){
    'use strict';

    var async = require('async'),
        path = require('path'),
        _ = require('underscore'),
        grasshopper = require('../../lib/grasshopper'),
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
        grasshopper.configure(function(){
            this.config = {
                'crypto': {
                    'secret_passphrase' : '223fdsaad-ffc8-4acb-9c9d-1fdaf824af8c'
                },
                'db': {
                    'type': 'mongodb',
                    'host': 'mongodb://localhost:27017/test',
                    'database': 'test',
                    'username': '',
                    'password': '',
                    'debug': false
                },
                'assets': {
                    'default' : 'local',
                    'tmpdir' : path.join(__dirname, 'tmp'),
                    'engines': {
                        'local' : {
                            'path' : path.join(__dirname, 'public'),
                            'urlbase' : 'http://localhost'
                        }
                    }
                }
            };
        });

        _.each(tokenRequests, function(theRequest) {
            parallelTokenRequests.push(createGetToken(theRequest[0], theRequest[1], theRequest[2]).closure);
        });
        async.parallel(parallelTokenRequests, insertContent.bind(null, done));

    });

    describe('query', function() {
        var query = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test1'}]
            },
            query2 = {
                filters: [{key: 'nonsense', cmp: '=', value: 'XXXNEVERSHOULDMATCHANTYHINGXXX'}],
                options: {}
            },
            query3 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test2'}],
                options: {
                    include: ['fields.testfield']
                }
            },
            query4 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test3'}],
                options: {
                    exclude: ['fields.newColumn']
                }
            },
            query5 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test4'}],
                options: {
                    sortBy: 1111
                }
            },
            query6 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test5'}],
                options: []
            },
            query7 = {
                filters: [],
                nodes: ['526d5179966a883540000006']
            },
            query8 = {
                filters: [{key: 'fields.label', cmp: '=', value: 'search test6'}],
                options : {
                    limit : 1
                }
            };

        before(function(done){
            var base = {
                meta: {
                    type: '524362aa56c02c0703000001',
                    node : '526d5179966a883540000006',
                    labelfield: 'testfield'
                }
            };

            grasshopper.request(tokens.globalEditorToken)
                .content.insert(_.extend({
                    fields:{
                        label:'search test1'
                    }
                }, base))
                .then(function(){
                    return grasshopper.request(tokens.globalEditorToken).content.insert(_.extend({
                        fields:{
                            label:'search test2',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalEditorToken).content.insert(_.extend({
                        fields:{
                            label:'search test3',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalEditorToken).content.insert(_.extend({
                        fields:{
                            label:'search test4',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalEditorToken).content.insert(_.extend({
                        fields:{
                            label:'search test5',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalAdminToken).content.insert(_.extend({
                        fields:{
                            label:'search test6',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .then(function() {
                    return grasshopper.request(tokens.globalAdminToken).content.insert(_.extend({
                        fields:{
                            label:'search test6',
                            testfield: 'testvalue',
                            newColumn: 'testvalue'
                        }
                    }, base));
                })
                .done(done.bind(done, undefined));
        });

        it('should not a 401 because trying to access unauthenticated', function(done) {
            grasshopper.request().content.query(query).then(
                function(payload){
                    should.not.exist(payload);
                },
                function(err){
                    err.code.should.equal(401);
                }
            ).done(done);
        });

        it('should return array of search results.', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query).then(
                function(payload){
                    payload.results.length.should.equal(1);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('test "including" fields in a query', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query3).then(
                function(payload){
                    payload.results.length.should.equal(1);
                    payload.results[0].fields.testfield.should.equal('testvalue');
                    payload.results[0].fields.should.not.have.property('newColumn');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('test "excluding" fields in a query', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query4).then(
                function(payload){
                    payload.results.length.should.equal(1);
                    payload.results[0].fields.should.have.property('testfield');
                    payload.results[0].fields.should.not.have.property('newColumn');
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('should return empty results if it finds nothing', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query2).then(
                function(payload){
                    payload.results.length.should.equal(0);
                },
                function(err){
                    should.not.exist(err);
                }
            ).done(done);
        });

        it('return valid results even if sortBy is not valid', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query5)
                .then(function(payload){
                    payload.results.length.should.equal(1);
                    done();
                })
                .catch(doneError.bind(null, done))
                .fail(doneError.bind(null, done))
                .done();
        });

        it('return valid results even if options is an empty array', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query6)
                .then(function(payload){
                    payload.results.length.should.equal(1);
                })
                .fail(function(err){
                    should.not.exist(err);
                })
                .done(done);
        });

        it('return valid results for everything within a node', function(done) {
            grasshopper.request(tokens.globalReaderToken).content.query(query7)
                .then(function(payload){
                    payload.total.should.be.greaterThan(0);
                    done();
                })
                .catch(doneError.bind(null, done))
                .fail(doneError.bind(null, done))
                .done();
        });

        it('returns distinct values within a find', function(done) {
            grasshopper
                .request(tokens.globalReaderToken)
                .content.query({
                    filters: [{key: 'meta.type', cmp: '=', value: '524362aa56c02c0703000001'}],
                    options: {
                        distinct : 'fields.label'
                    }
                })
                .then(function(payload){
                    var ary = [
                        'Generated title',
                        'search test1',
                        'search test2',
                        'search test3',
                        'search test4',
                        'search test5',
                        'search test6'
                    ];

                    _.difference(payload.results, ary).should.deep.equal([]);

                    done();
                })
                .catch(doneError.bind(null, done))
                .fail(doneError.bind(null, done))
                .done();
        });

        it('distinct works with types', function(done) {
            grasshopper
                .request(tokens.globalReaderToken)
                .content.query({
                    types : ['524362aa56c02c0703000001'],
                    options: {
                        distinct : 'fields.label'
                    }
                })
                .then(function(payload){
                    var ary = [
                        'Generated title',
                        'search test1',
                        'search test2',
                        'search test3',
                        'search test4',
                        'search test5',
                        'search test6'
                    ];

                    _.difference(payload.results, ary).should.deep.equal([]);

                    done();
                })
                .catch(doneError.bind(null, done))
                .fail(doneError.bind(null, done))
                .done();
        });

        describe('limit', function() {
            it('should limit the results, based on the options.limit', function(done) {
                grasshopper.request(tokens.globalAdminToken).content.query(query8)
                    .then(function(payload){
                        payload.results.length.should.equal(1);

                        done();
                    })
                    .fail(doneError.bind(null, done))
                    .catch(doneError.bind(null, done))
                    .done();
            });
        });
    });

    function doneError(done, err) {
        done(err);
    }

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

    function insertContent(done) {
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

        grasshopper
            .request(tokens.globalEditorToken)
            .content.insert(obj)
            .done(done.bind(done, undefined));
    }
});