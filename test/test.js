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

// describe('Admins', function () {
//     let adminKey = stellar.Keypair.random();
// console.log(adminKey.accountId())
//     it('create', function () {
//         return SmartApi.Admins.create({
//             account_id: adminKey.accountId(),
//             name: 'Name',
//             position: 'Position',
//             comment: 'Comment'
//         })
//     });

//     it('get', function () {
//         return SmartApi.Admins.get({
//             account_id: adminKey.accountId(),
//         })
//     });

//     // it('getList', function () {
//     //     return SmartApi.Admins.getList({
//     //         account_ids: [adminKey.accountId()],
//     //     })
//     // });

//     it('delete', function () {
//         return SmartApi.Admins.delete({
//             account_id: adminKey.accountId(),
//         })
//     });
// });

// describe('Companies', function () {
//     let company_code = Date.now().toString();
// console.log(company_code)
//     it('create', function () {
//         return SmartApi.Companies.create({
//             code: company_code,
//             title: 'Test company',
//             address: 'Address',
//             phone: '123123',
//             email: Date.now() + '-debug@debug.com',
//         })
//     });

//     it('get', function () {
//         return SmartApi.Companies.get({
//             code: company_code,
//         })
//     });

//     it('getList', function () {
//         return SmartApi.Companies.getList()

//     });
// });

describe('Agents', function () {
    // var companyCode = Date.now().toString() + '-agent';

    // it('create', function() {
    //     return SmartApi.Companies.create({
    //         code: companyCode,
    //         title: 'Test company',
    //         address: 'Address',
    //         phone: '123123',
    //         email: Date.now() + '-debug@debug.com',
    //     }).then(() => {
    //         return SmartApi.Agents.create({
    //             type: testParams.distributionType,
    //             asset: 'EUAH',
    //             company_code: companyCode,
    //         })
    //     })
    // });

    // it('getList', function() {
    //     return SmartApi.Agents.getList({
    //         company_code: companyCode,
    //         type: testParams.distributionType,
    //     })
    // });

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

//     it('getList', function () {
//         return SmartApi.Bans.getList()
//     });

//     it('delete', function () {
//         return SmartApi.Bans.delete({
//             ip: testParams.ipAddr,
//         })
//     });
// });

// describe('Invoices', function () {
//     let invId;

//     it('create', function () {
//         return SmartApi.Invoices.create({
//                 asset: 'EUAH',
//                 amount: 100,
//             })
//             .then(resp => {
//                 invId = resp.data.id;
//                 return Promise.resolve(resp);
//             })

//     });

//     it('get', function () {
//         return SmartApi.Invoices.get({
//             id: invId
//         })
//     });

//     it('getList', function () {
//         return SmartApi.Invoices.getList({
//             limit: 10,
//             offset: 0
//         })
//     });

//     it('getStatistics', function () {
//         return SmartApi.Invoices.getStatistics({
//             limit: 10,
//             offset: 0
//         })
//     });
// });

// describe('Cards', function () {
// });

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
        })
    });

    it('getList', function () {
        return SmartApi.Customers.getList()
            .then(function (resp) {
                console.log(resp)
            })
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

// describe('Merchants', function () {
//     let storeData = {};
//     let orderData = {};
//     it('createStore', function () {
//         return SmartApi.Merchants.createStore({
//                 url: 'debug-' + Date.now() + '.com',
//                 name: 'Name'
//             })
//             .then(resp => {
//                 storeData = resp.data;
//                 return Promise.resolve(resp);
//             })

//     });

//     it('getStores', function () {
//         return SmartApi.Merchants.getStores({
//                 limit: 10,
//                 offset: 0
//             })

//     });

//     it('createOrder', function () {

//         let orderParams = {
//             amount: 1.23,
//             currency: 'UAH',
//             order_id: '1',
//             details: 'Details',
//             server_url: storeData.url,
//             success_url: storeData.url,
//             fail_url: storeData.url,
//         };

//         let signData = {
//             'amount' : orderParams.amount,
//             'currency' : orderParams.currency,
//             'details' : orderParams.details,
//             'order_id' : orderParams.order_id,
//             'store_id' : storeData.store_id,
//         };

//         let signature = new Buffer(sha256(storeData.secret_key + new Buffer(JSON.stringify(signData)).toString('base64'))).toString('base64');

//         return SmartApi.Merchants.createOrder({
//                 store_id: storeData.store_id,
//                 amount: orderParams.amount,
//                 currency: orderParams.currency,
//                 order_id: orderParams.order_id,
//                 server_url: orderParams.server_url,
//                 success_url: orderParams.success_url,
//                 fail_url: orderParams.fail_url,
//                 details: orderParams.details,
//                 signature: signature
//             })
//             .then(resp => {
//                 orderData = resp.data;
//                 return Promise.resolve(resp);
//             })

//     });

//     it('getStoreOrders', function () {
//         return SmartApi.Merchants.getStoreOrders({
//                 store_id: storeData.store_id
//             })

//     });

//     it('getOrder', function () {
//         return SmartApi.Merchants.getOrder({
//             order_id: orderData.id
//         })
//     });

// });
