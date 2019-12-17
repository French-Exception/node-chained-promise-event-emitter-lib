"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require('events');
class ChainedPromiseEventEmitter extends EventEmitter {
    constructor(logger) {
        super();
        this.logger = logger;
        this.initPromises();
    }
    chain(name, promiseFn) {
        const self = this;
        let start;
        let end;
        this.logger.trace('chaining %s', name);
        this._chain = this._chain.then(() => {
            return new Promise((resolve, reject) => {
                start = new Date();
                self.logger.trace('%s start chain', name, start);
                const result = (() => {
                    try {
                        const p = promiseFn.bind(self)((...args) => {
                            end = new Date();
                            resolve(...args);
                        }, (...args) => {
                            end = new Date();
                            reject(...args);
                        });
                        return p;
                    }
                    catch (e) {
                        self.logger.error('%s chain error: %s', name, e.toString());
                        return reject(new Error('%s error in chain execution : ' + e.toString()));
                    }
                })();
                if (result && result instanceof Promise) {
                    result
                        .catch((e) => {
                        self.logger.error('%s chained promise error: %s', name, e.toString());
                    })
                        .then((result) => {
                        resolve(result);
                    });
                }
                return result;
            })
                .then(() => {
                const end = new Date();
                const diffSeconds = (end - start) / 1000;
                self.logger.trace('%s end chain, finished in %s seconds', name, diffSeconds);
            });
        });
        return this;
    }
    initPromises() {
        const promises = (() => {
            const p = {};
            p.promise = new Promise((_resolve, _reject) => {
                p.resolve = () => {
                    _resolve();
                };
                p.reject = (e) => {
                    _reject(e);
                };
            });
            return p;
        })();
        this.start = promises.resolve;
        this.fail = promises.reject;
        this._chain = promises.promise;
    }
    async run() {
        this.start();
        return this._chain;
    }
    promise() {
        return this._chain;
    }
}
exports.ChainedPromiseEventEmitter = ChainedPromiseEventEmitter;
//# sourceMappingURL=ChainedPromiseEventEmitter.js.map