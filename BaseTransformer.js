'use strict';

class BaseTransformer {
    constructor(name) {
        this.name = name;
    }
    supports() {
        return true;
    }
    transform() {
        throw new Error(
            `${this.name} debe implementar transform().`
        );
    }
}

module.exports = BaseTransformer;