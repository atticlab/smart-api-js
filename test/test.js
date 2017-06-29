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

describe('Admins', function () {
    it('create', function () {
        let adminKey = stellar.Keypair.random();
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
        let adminKey = stellar.Keypair.random();
        return SmartApi.Admins.create({
            account_id: adminKey.accountId(),
            name: 'Name',
            position: 'Position',
            comment: 'Comment'
        }).then(() => {
            return SmartApi.Admins.get({
                account_id: adminKey.accountId()
            })
        }).should.eventually.have.property('data')
            .that.has.property('account_id')
            .that.equal(adminKey.accountId());
    });

    it('getList', function () {
        let adminKey = stellar.Keypair.random();
        return SmartApi.Admins.create({
            account_id: adminKey.accountId(),
            name: 'Name',
            position: 'Position',
            comment: 'Comment'
        }).then(() => {
            return sleep(1);
        }).then(() => {
                return SmartApi.Admins.getList()
            })
            .should.eventually.have.property('data')
            .to.be.an('array')
            .that.is.not.empty
    });

    it('delete', function () {
        let adminKey = stellar.Keypair.random();
        return SmartApi.Admins.create({
            account_id: adminKey.accountId(),
            name: 'Name',
            position: 'Position',
            comment: 'Comment'
        }).then(() => {
            return SmartApi.Admins.delete({
                account_id: adminKey.accountId(),
            })
        }).should.eventually.have.property('data')
            .that.has.property('deleted')
            .that.equal(true);
    });
});

describe('Agents', function () {
    it('create', function () {
        let companyCode = Date.now().toString() + '-agent-create';
        return SmartApi.Companies.create({
            code: companyCode,
            title: 'Test company',
            address: 'Address',
            phone: '123123',
            email: Date.now() + '-debug@debug.com'
        }).then(() => {
            return SmartApi.Agents.create({
                type: testParams.distributionType,
                asset: 'EUAH',
                company_code: companyCode,
            }).should.eventually.have.property('data')
                .that.has.property('created_at');
        })
    });

    it('getList', function () {
        let companyCode = Date.now().toString() + '-agent-list';

        return SmartApi.Companies.create({
            code: companyCode,
            title: 'Test company',
            address: 'Address',
            phone: '123123',
            email: Date.now() + 'agent-list-debug@debug.com'
        }).then(() => {
            return SmartApi.Agents.create({
                type: testParams.distributionType,
                asset: 'EUAH',
                company_code: companyCode
            })
        }).then(resp => {
            return SmartApi.Agents.getList({
                company_code: companyCode,
                type: testParams.distributionType,
            });
        }).should.eventually.have.property('data')
            .to.be.an('array')
            .that.has.property(0)
            .that.has.property('agent_type')
            .that.equals(testParams.distributionType)
    });

    it('getByEnrollment', function () {
        let companyCode = Date.now().toString() + '-agent-enrollment';
        let enrollment;

        return SmartApi.Companies.create({
            code: companyCode,
            title: 'Test company',
            address: 'Address',
            phone: '123123',
            email: Date.now() + 'agent-enrollment-debug@debug.com'
        }).then(() => {
            return SmartApi.Agents.create({
                type: testParams.distributionType,
                asset: 'EUAH',
                company_code: companyCode
            })
        }).then(function (resp) {
            enrollment = resp.data.enrollment;
            return sleep(1);
        }).then(function () {
            return SmartApi.Agents.getByEnrollment({
                enrollment: enrollment
            });
        }).should.eventually.have.property('data')
            .that.has.property('agent_type')
            .that.equals(testParams.distributionType)
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
            .to.be.an('array')
            .that.is.not.empty
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
            .to.be.an('array')
            .that.is.not.empty
    });
});

describe('Customers', function () {
    it('create', function () {
        return SmartApi.Customers.create({
            'ipn': Date.now().toString(),
            'passport': Date.now().toString(),
            'email': 'debug@' + Date.now() + '.com',
            'address': "Some address",
            'name': "John",
            'lastname': "Doe",
            'middlename': "Stephenson",
            'phone': Date.now()
        }).should.eventually.have.property('data')
            .that.has.property('created_at');
    });

    it('getList', function () {
        let ipn = "getlist-" + Date.now().toString();
        return SmartApi.Customers.create({
            'ipn': ipn,
            'passport': ipn,
            'email': 'getlist@' + Date.now() + '.com',
            'address': "Some address",
            'name': "John",
            'lastname': "Doe",
            'middlename': "Stephenson",
            'phone': Date.now()
        }).then(function (resp) {
            return sleep(1)
        }).then(function () {
            return SmartApi.Customers.getList({
                ipn: ipn
            })
        }).should.eventually.have.property('data')
            .to.be.an('array')
            .that.has.property(0)
            .that.has.property('ipn')
            .that.equals(ipn)
    });

    it('getByEnrollment', function () {
        let ipn = "enrollment-" + Date.now().toString();
        let enrollment;

        return SmartApi.Customers.create({
            'ipn': ipn,
            'passport': ipn,
            'email': 'enrollment@' + Date.now() + '.com',
            'address': "Some address",
            'name': "John",
            'lastname': "Doe",
            'middlename': "Stephenson",
            'phone': Date.now()
        }).then(function (resp) {
            enrollment = resp.data.enrollment;
            return sleep(1);
        }).then(function () {
            return SmartApi.Customers.getByEnrollment({
                enrollment: enrollment
            });
        }).should.eventually.have.property('data')
            .that.has.property('ipn')
            .that.equals(ipn)
    });
});

describe('Enrollments', function () {
    it('accept', function () {
        var companyCode = Date.now().toString() + '-agent';

        // return SmartApi.Enrollments.accept({
        //     enrollment: "AuuVIEHZ3t9wIPCqMPa90kFrmtAWrMWiTAzLM6bwTuK4D-Q7KQePi8Cf2aUF0GmOSwgzfUeph0scvAaHY9Llqg61CiZWy3cA2bvt3OzfyIEKXm00nD0PpK1GY22W2ZFe-7Jf_QaPyenJZgO45dog45Q0eTSLT2iXtLNaSoCOWilg="
        // })
    });

    it('decline', function () {
        var companyCode = Date.now().toString() + '-agent';

        // return SmartApi.Enrollments.decline({
        //     enrollment: "AuuVIEHZ3t9wIPCqMPa90kFrmtAWrMWiTAzLM6bwTuK4D-Q7KQePi8Cf2aUF0GmOSwgzfUeph0scvAaHY9Llqg61CiZWy3cA2bvt3OzfyIEKXm00nD0PpK1GY22W2ZFe-7Jf_QaPyenJZgO45dog45Q0eTSLT2iXtLNaSoCOWilg="
        // })
    });

    it('approve', function () {
        var companyCode = Date.now().toString() + '-agent';

        // return SmartApi.Enrollments.approve({
        //     enrollment: "AuuVIEHZ3t9wIPCqMPa90kFrmtAWrMWiTAzLM6bwTuK4D-Q7KQePi8Cf2aUF0GmOSwgzfUeph0scvAaHY9Llqg61CiZWy3cA2bvt3OzfyIEKXm00nD0PpK1GY22W2ZFe-7Jf_QaPyenJZgO45dog45Q0eTSLT2iXtLNaSoCOWilg="
        // })
    });
});

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
            .to.be.an('array')
            .that.is.not.empty
    });

    it('getStatistics', function () {
        return SmartApi.Invoices.getStatistics({
            limit: 10,
            offset: 0
        }).should.eventually.have.property('data')
            .to.be.an('array')
            .that.is.not.empty
    });
});

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
            .to.be.an('array')
            .that.is.not.empty

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
            'amount': orderParams.amount,
            'currency': orderParams.currency,
            'details': orderParams.details,
            'order_id': orderParams.order_id,
            'store_id': storeData.id,
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
            .to.be.an('array')
            .that.is.not.empty

    });

    it('getOrder', function () {
        return SmartApi.Merchants.getOrder({
            order_id: orderData.id
        }).should.eventually.have.property('data')
            .that.has.property('details')
            .that.equal('Details');
    });
});

function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000));
}