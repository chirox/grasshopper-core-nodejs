module.exports = function(ObjectID) {
    'use strict';

    return [
        {
            _id: ObjectID('5246e73d56c02c0744000004'),
            role: 'admin',
            enabled: true,
            firstname: 'Test',
            lastname: 'User',
            identities: {
                basic: {
                    username: 'admin',
                    salt: '225384010328',
                    hash: '885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03'
                }
            },
            displayName : 'admin',
            linkedIdentities : ['basic'],
            email: 'apitestuser@thinksolid.com'
        },
        {
            _id: ObjectID('5246e73d56c02c0744000001'),
            role: 'admin',
            enabled: true,
            firstname: 'Test',
            lastname: 'User',
            identities: {
                basic: {
                    username: 'apitestuseradmin',
                    salt: '225384010328',
                    hash: '885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03'
                }
            },
            displayName: 'apitestuseradmin',
            linkedIdentities : ['basic'],
            email: 'apitestuser@thinksolid.com'
        },
        {
            _id: ObjectID('5246e80c56c02c0744000002'),
            role: 'reader',
            enabled: true,
            firstname: 'Test',
            lastname: 'User',
            identities: {
                basic: {
                    username: 'apitestuserreader',
                    salt: '225384010328',
                    hash: '885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03'
                }
            },
            displayName : 'apitestuserreader',
            linkedIdentities : ['basic'],
            email: 'apitestuser@thinksolid.com',
            permissions: [
                {
                    nodeid : ObjectID('526d5179966a883540000006'),
                    role: 'none'
                }
            ]
        },
        {
            _id: ObjectID('52619b3dabc0ca310d000003'),
            role: 'reader',
            enabled: true,
            firstname: 'Test',
            lastname: 'User With Editing permisions on a node',
            identities: {
                basic: {
                    username: 'apitestuserreader_1',
                    salt: '225384010328',
                    hash: '885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03'
                }
            },
            displayName : 'apitestuserreader_1',
            linkedIdentities : ['basic'],
            email: 'apitestuser_1@thinksolid.com',
            permissions: [
                {
                    nodeid : ObjectID('52712a3e2eacd5a714000006'),
                    role: 'none'
                }
            ]
        },
        {
            _id: ObjectID('5261777656c02c072a000001'),
            role: 'editor',
            enabled: true,
            firstname: 'Test',
            lastname: 'User',
            identities: {
                basic: {
                    username: 'apitestusereditor',
                    salt: '225384010328',
                    hash: '885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03'
                }
            },
            displayName : 'apitestusereditor',
            linkedIdentities : ['basic'],
            email: 'apitestusereditor@thinksolid.com'
        },
        {
            _id: ObjectID('5261b811a94c1a971f000003'),
            role: 'editor',
            enabled: true,
            firstname: 'Test',
            lastname: 'User',
            identities: {
                basic: {
                    username: 'apitestusereditor_restricted',
                    salt: '225384010328',
                    hash: '885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03'
                }
            },
            displayName : 'apitestusereditor_restricted',
            linkedIdentities : ['basic'],
            email: 'apitestusereditor_1@thinksolid.com',
            permissions: [
                {
                    nodeid : ObjectID('5261781556c02c072a000007'),
                    role: 'reader'
                },
                {
                    nodeid : ObjectID('526d5179966a883540000006'),
                    role: 'none'
                },
                {
                    nodeid: ObjectID('5261777656c02c072a000001'),
                    role: 'none'
                }
            ]
        },
        {
            _id: ObjectID('5245ce1d56c02c066b000001'),
            email: 'apitestuser@thinksolid.com',
            identities: {
                basic: {
                    username: 'apitestuser',
                    salt: '225384010328',
                    hash: '885f59a76ea44e1d264f9da45ca83574fbe55e3e7e6c51afe681730b45c7bb03'
                }
            },
            displayName : 'apitestuser',
            linkedIdentities : ['basic'],
            enabled: true,
            role: 'reader',
            firstname: 'Test',
            lastname: 'User'
        }
    ];
};