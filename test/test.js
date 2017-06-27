/* * Copyright 2017 Atticlab LLC.
 * Licensed under the Apache License, Version 2.0
 * See the LICENSE or LICENSE_UA file at the root of this repository
 * Contact us at http://atticlab.net
 */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const stellar = require('stellar-sdk');
const sha256 = require('sha256');

chai.use(chaiAsPromised);
chai.use(require('chai-things'));
chai.should();

var smart_api = require('../index.js');

var SmartApi = new smart_api({
    host: 'http://localhost:8080/v1'
});

var testParams = {
    user: '__debug-' + Date.now(),
    pwd: '__debug__',
    distributionType: 3,
    ipAddr: '25.55.191.171'
};

// Set keypair for signed requests
SmartApi.setKeypair(stellar.Keypair.random());

// describe('Wallets', function () {
//     it('Check if username is free', function () {
//         return SmartApi.Wallets.notExist({
//             username: testParams.user
//         });
//     });

//     it('Create and get wallet object', () => {
//         return SmartApi.Wallets.create({
//                 username: testParams.user,
//                 password: testParams.pwd,
//                 accountId: SmartApi.Api.keypair.accountId(),
//                 publicKey: SmartApi.Api.keypair._publicKey.toString('base64'),
//                 keychainData: SmartApi.Api.keypair.seed(),
//                 mainData: 'mainData',
//             })
//             .should.eventually.be.instanceof(wallet)
//             .then(() => {
//                 return SmartApi.Wallets.get({
//                     username: testParams.user,
//                     password: testParams.pwd,
//                 });
//             })
//             .should.eventually.be.instanceof(wallet);
//     });

//     it('Update wallet email', function () {
//         return SmartApi.Wallets.get({
//                 username: testParams.user,
//                 password: testParams.pwd,
//             })
//             .then(wallet => {
//                 return wallet.update({
//                     update: {email: 'debug@' + Date.now() + '.com'},
//                     secretKey: SmartApi.Api.keypair._secretKey.toString('base64')
//                 });
//             }).should.eventually.be.instanceof(wallet);
//     });

//     it('Update wallet password', function () {
//         return SmartApi.Wallets.get({
//                 username: testParams.user,
//                 password: testParams.pwd,
//             })
//             .then(wallet => {
//                 return wallet.updatePassword({
//                     newPassword: '__debug__changed__',
//                     secretKey: 'Z6W7f1np2/Ol2U/Hck0ZUjxiuZrE2lES7F8s0aYNXsPL2g2VblaJ02Gk2WVyCjVHo6PmQEgoXp347Y45d2PnGw=='
//                 });
//             }).should.eventually.be.instanceof(wallet);
//     });

//     it('Get wallet data', function () {
//         return SmartApi.Wallets.getWalletData({
//                 username: testParams.user
//             })
//     });
// });

describe('Admins', function () {
    let adminKey = stellar.Keypair.random();
    it('create', function () {
        return SmartApi.Admins.create({
            account_id: adminKey.accountId(),
            name: 'Name',
            position: 'Position',
            comment: 'Comment'
        }).should.eventually.have.property('data')
            .that.has.property('name')
            .that.equal('Name')
    });

    it('get', function () {
        return SmartApi.Admins.get({
            account_id: adminKey.accountId(),
        }).should.eventually.have.property('data')
            .that.has.property('account_id')
            .that.equal(adminKey.accountId());
    });


    it('getList', function () {
        return SmartApi.Admins.getList({
            account_ids: [adminKey.accountId()],
        }).should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;
            //.that.contain.a.thing.with.property('account_id')
            // .that.equal(adminKey.accountId());
    });

    it('delete', function () {
        return SmartApi.Admins.delete({
            account_id: adminKey.accountId(),
        }).should.eventually.have.property('data')
            .that.has.property('deleted')
            .that.equal(true);
    });
});

describe('Companies', function () {
    let company_code = Date.now().toString();
    it('create', function () {
        return SmartApi.Companies.create({
            code: company_code,
            title: 'Test company',
            address: 'Address',
            phone: '123123',
            email: Date.now() + '-debug@debug.com',
        }).should.eventually.have.property('data')
            .that.has.property('code')
            .that.equal(company_code);
    });

    it('get', function () {
        return SmartApi.Companies.get({
            code: company_code,
        }).should.eventually.have.property('data')
            .that.has.property('code')
            .that.equal(company_code);
    });

    it('getList', function () {
        return SmartApi.Companies.getList()
            .should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;
    });
});

describe('Agents', function () {
    var companyCode = Date.now().toString() + '-agent';

    it('create', function() {
        return SmartApi.Companies.create({
            code: companyCode,
            title: 'Test company',
            address: 'Address',
            phone: '123123',
            email: Date.now() + '-debug@debug.com',
        }).then(() => {
            return SmartApi.Agents.create({
                type: testParams.distributionType,
                asset: 'EUAH',
                company_code: companyCode,
            }).should.eventually.have.property('data')
                .that.has.property('created_at');
        })
    });

    it('getList', function() {
        return SmartApi.Agents.getList({
            company_code: companyCode,
            type: testParams.distributionType,
        }).should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;
    });

    // it('getByEnrollment', function() {
    //     return SmartApi.Agents.getByEnrollment({
    //         enrollment: "AcYg7DAs5yrR1sMN0",
    //     }).then(function(resp) {
    //         console.log(resp)
    //     })
    // });

    // it('updateByEnrollment', function() {
    //     return SmartApi.Agents.updateByEnrollment({
    //         enrollment: "AcYg7DAs5yrR1sMN0",
    //         login: "Test Login"
    //     }).then(function(resp) {
    //         console.log(resp)
    //     })
    // });
});

// describe('Bans', function () {
//     it('create', function () {
//         return SmartApi.Bans.create({
//             ip: testParams.ipAddr,
//             ttl: 1000
//         })
//     });
//
//     it('getList', function () {
//         return SmartApi.Bans.getList()
//     });
//
//     it('delete', function () {
//         return SmartApi.Bans.delete({
//             ip: testParams.ipAddr,
//         })
//     });
// });

describe('Invoices', function () {
    let invId;

    it('create', function () {
        return SmartApi.Invoices.create({
                asset: 'EUAH',
                amount: 100,
            })
            .then(resp => {
                invId = resp.data.id;
                return Promise.resolve(resp);
            }).should.eventually.have.property('data')
            .that.has.property('id');

    });

    it('get', function () {
        return SmartApi.Invoices.get({
            id: invId
        }).should.eventually.have.property('data')
            .that.has.property('amount')
            .that.equal(100);
    });

    it('getList', function () {
        return SmartApi.Invoices.getList({
            limit: 10,
            offset: 0
        }).should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;
    });

    it('getStatistics', function () {
        return SmartApi.Invoices.getStatistics({
            limit: 10,
            offset: 0
        }).should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;
    });
});

describe('Cards', function () {
    var accountId = "GAE6COEIP34KH2DUULXB6NR2OP35O4EX6WSR3X5DBOLL2UFYR3IOM6I7";
    var data = '{"GCLNAEBJPO5GJ35WPLQQFT573HFKLWJSYLQ7HYCY3TBVBG5BJAVCOLDW":"eyJpdiI6IjdhVVBZSTdjRXpYcTN0dFVFOTZnbEE9PSIsInYiOjEsIml0ZXIiOjEwMDAsImtzIjoxMjgsInRzIjo2NCwibW9kZSI6ImNjbSIsImFkYXRhIjoiIiwiY2lwaGVyIjoiYWVzIiwic2FsdCI6IjBSaHoxNlg2R0g4PSIsImN0IjoiNEFsZnBQaktYeCs4SEVmR1h5ejY3Q2hUNkViSHNwbTM5RDdBYjFGbThQMG5VY0tHVWNOMmMrYkN5b3FpNndHNjltNG5jZm5xNXJpRjhGVmRQeVJFdkE9PSJ9","GAE6COEIP34KH2DUULXB6NR2OP35O4EX6WSR3X5DBOLL2UFYR3IOM6I7":"eyJpdiI6IlFNTXh3QWJBcmc1V0d2eGI1b2gzOWc9PSIsInYiOjEsIml0ZXIiOjEwMDAsImtzIjoxMjgsInRzIjo2NCwibW9kZSI6ImNjbSIsImFkYXRhIjoiIiwiY2lwaGVyIjoiYWVzIiwic2FsdCI6IjBSaHoxNlg2R0g4PSIsImN0IjoiQ2xVSWVZZmNwWlB3RTQzQ3hWZmVzb0J5TEZjU3B2dkRnQXZldUFBWlgraGdqMHJVZm42aC9DREsrY2E2QnByTEgxN255TGdkVGlVMHlNOFlrNjQrRVE9PSJ9"}';
    var dataCount = 2;
    var tx = 'AAAAAN3m0UIfev8P52csRt1gtSqtlNt7PL9kiVPABmV0U+USAAAAAAAAAAAAAABaAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAltAQKXu6ZO+2euECz7/ZyqXZMsLh8+BY3MNQm6FIKicAAAAHAAAAAUVVQUgAAAAALID8k8Glai3cqH4/S5rC3mQL88fxqUkqq6bIXr2aF4sAAAAAWWgvAAAAAAAAAAAAAAAAAAnhOIh++KPodKLuHzY6c/fXcJf1pR3fowuWvVC4jtDmAAAABwAAAAFFVUFIAAAAACyA/JPBpWot3Kh+P0uawt5kC/PH8alJKqumyF69mheLAAAAAFloLwAAAAAAAAAAAXRT5RIAAABA8htipWKNw/HtHFancj6CqkoVK2RhpkTXLqex63oBijhDJ+HgM2RdrHr4RKaQNEETB98VqTQqy5DIyy0QPkw9DQAAAAA=';

    it('create', function () {
        return SmartApi.Cards.create({
            data: data,
            tx: tx
        })
        .then(resp => {
            return Promise.resolve(resp);
        }).should.eventually.have.property('data')
        .that.has.property('created_count')
        .that.equal(dataCount);
    });

    it('get', function () {
        return SmartApi.Cards.get({
            account_id: accountId
        }).should.eventually.have.property('data')
            .that.has.property('account_id')
            .that.equal(accountId);
    });


    it('getList', function () {
        return SmartApi.Cards.getList({
            limit: 10,
            offset: 0
        }).should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;
    });

});

describe('Customers', function () {
    let ipnCode = Date.now().toString();
    let email = 'debug@' + Date.now() + '.com';
    let phone = Date.now();

    it('create', function () {
        return SmartApi.Customers.create({
            'ipn': ipnCode,
            'passport': ipnCode,
            'email': email,
            'address': "Some address",
            'name': "John",
            'lastname': "Doe",
            'middlename': "Stephenson",
            'phone': phone,
        }).should.eventually.have.property('data')
            .that.has.property('created_at');
    });

    it('getList', function () {
        return SmartApi.Customers.getList()
            .should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;
    });
});

// describe('Enrollments', function () {
//     it('decline', function () {
//        var companyCode = Date.now().toString() + '-agent';

//         return SmartApi.Enrollments.decline({
//             enrollment: "AuuVIEHZ3t9wIPCqMPa90kFrmtAWrMWiTAzLM6bwTuK4D-Q7KQePi8Cf2aUF0GmOSwgzfUeph0scvAaHY9Llqg61CiZWy3cA2bvt3OzfyIEKXm00nD0PpK1GY22W2ZFe-7Jf_QaPyenJZgO45dog45Q0eTSLT2iXtLNaSoCOWilg="
//         })
//     });
// });

describe('Merchants', function () {
    let storeData = {};
    let orderData = {};
    it('createStore', function () {
        return SmartApi.Merchants.createStore({
                url: 'debug-' + Date.now() + '.com',
                name: 'Name'
            })
            .then(resp => {
                storeData = resp.data;
                return Promise.resolve(resp);
            }).should.eventually.have.property('data')
            .that.has.property('title')
            .that.equal('Name');

    });

    it('getStores', function () {
        return SmartApi.Merchants.getStores({
                limit: 10,
                offset: 0
            }).should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;

    });

    it('createOrder', function () {

        let orderParams = {
            amount: 1.23,
            currency: 'UAH',
            order_id: '1',
            details: 'Details',
            server_url: storeData.url,
            success_url: storeData.url,
            fail_url: storeData.url,
        };

        let signData = {
            'amount' : orderParams.amount,
            'currency' : orderParams.currency,
            'details' : orderParams.details,
            'order_id' : orderParams.order_id,
            'store_id' : storeData.id,
        };

        let signature = new Buffer(sha256(storeData.secret_key + new Buffer(JSON.stringify(signData)).toString('base64'))).toString('base64');

        return SmartApi.Merchants.createOrder({
                store_id: storeData.id,
                amount: orderParams.amount,
                currency: orderParams.currency,
                order_id: orderParams.order_id,
                server_url: orderParams.server_url,
                success_url: orderParams.success_url,
                fail_url: orderParams.fail_url,
                details: orderParams.details,
                signature: signature
            })
            .then(resp => {
                orderData = resp.data;
                return Promise.resolve(resp);
            }).should.eventually.have.property('data')
            .that.has.property('details')
            .that.equal(orderParams.details);

    });

    it('getStoreOrders', function () {
        return SmartApi.Merchants.getStoreOrders({
                store_id: storeData.id
            }).should.eventually.have.property('data')
            .that.to.be.an('array')
            .that.is.notEmpty;

    });

    it('getOrder', function () {
        return SmartApi.Merchants.getOrder({
            order_id: orderData.id
        }).should.eventually.have.property('data')
            .that.has.property('details')
            .that.equal('Details');
    });

});
