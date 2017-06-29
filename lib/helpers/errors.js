/* * Copyright 2017 Atticlab LLC.
 * Licensed under the Apache License, Version 2.0
 * See the LICENSE or LICENSE_UA file at the root of this repository
 * Contact us at http://atticlab.net
 */
function createError(errorName) {
    var err = function (message, descr) {
        this.name = errorName;
        this.message = (message || "");
        this.description = (descr || "");
    };

    err.prototype = Error.prototype;
    return err;
};

module.exports = {
    InvalidField: createError('InvalidField'),
    MissingField: createError('MissingField'),
    ConnectionError: createError('ConnectionError'),
    DataCorrupt: createError('DataCorrupt'),
    ApiError: createError('ApiError'),
}