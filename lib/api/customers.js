/* * Copyright 2017 Atticlab LLC.
 * Licensed under the Apache License, Version 2.0
 * See the LICENSE or LICENSE_UA file at the root of this repository
 * Contact us at http://atticlab.net
 */
const validate = require('../helpers/validate.js');
const _ = require('lodash');

module.exports = class {
    constructor(parent) {
        this.parent = parent;
    }

    create(params) {
        var self = this;

        return Promise.resolve(params)
            .then(validate.string('ipn'))
            .then(validate.string('passport'))
            .then(validate.string('email'))
            .then(validate.string('address'))
            .then(validate.string('name'))
            .then(validate.string('lastname'))
            .then(validate.string('middlename'))
            .then(validate.number('phone'))
            .then(this.parent.getNonce.bind(this.parent))
            .then(function (params) {
                return self.parent.axios.post('/customers', _.pick(params, [
                    'ipn',
                    'passport',
                    'email',
                    'address',
                    'name',
                    'lastname',
                    'middlename',
                    'phone',
                ]))
            });
    }

    getList(params) {
        var self = this;

        return Promise.resolve(params)
            .then(validate.string('ipn', true))
            .then(validate.string('passport', true))
            .then(validate.string('address', true))
            .then(validate.email('email', true))
            .then(validate.number('phone', true))
            .then(validate.string('name', true))
            .then(validate.string('lastname', true))
            .then(validate.string('middlename', true))
            .then(validate.number('limit', true))
            .then(validate.number('offset', true))
            .then(this.parent.getNonce.bind(this.parent))
            .then(function (params) {
                return self.parent.axios.get('/customers', {
                    params: _.pick(params, [
                        'ipn',
                        'passport',
                        'email',
                        'address',
                        'name',
                        'lastname',
                        'middlename',
                        'phone',
                        'limit',
                        'offset'
                    ])
                });
            });
    }

    getByEnrollment(params) {
        var self = this;

        return Promise.resolve(params)
            .then(validate.string('enrollment'))
            .then(function (params) {
                return self.parent.axios.get('/customers/enrollment/' + params.enrollment);
            });
    }
}
