const EventEmitter = require('events');
import * as log4j from '@log4js-node/log4js-api';

export class ChainedPromiseEventEmitter extends EventEmitter {

    protected logger: log4j.Logger;

    private _chain: Promise<any>;
    private start: Function;
    private fail: Function;

    constructor(logger: log4j.Logger) {
        super();
        this.logger = logger;
        this.initPromises();
    }

    chain(name: string, promiseFn: (resolve: Function, reject: Function) => any): ChainedPromiseEventEmitter {
        const self = this;

        let start: Date;
        let end: Date;

        this.logger.trace('chaining %s', name);

        this._chain = this._chain.then(() => {
            return new Promise((resolve, reject) => {
                start = new Date();
                self.logger.trace('%s start chain', name, start);

                const result: any | Promise<any> = (() => {
                    try {
                        const p = promiseFn.bind(self)(
                            /** resolve **/(...args) => {
                                resolve(...args)
                            },
                            /** reject **/(...args) => {
                                reject(...args);
                            });
                        return p;
                    } catch (e) {
                        self.logger.error('%s chain error: %s', name, e.toString());
                        return reject(new Error('%s error in chain execution : ' + e.toString()));
                    }
                })();

                if (result && result instanceof Promise) {
                    <Promise<any>>result
                        .catch((e) => {
                            self.logger.error('%s chained promise error: %s', name, e.toString());
                        })
                        .then((result) => {
                            resolve(result);
                        })
                }

                return result;
            })
                .then(() => {
                    const end = new Date();
                    const diffSeconds = (<any>end - <any>start) / 1000;
                    self.logger.trace('%s end chain, finished in %s seconds', name, diffSeconds);
                })
        })

        return this;
    }

    private initPromises() {
        const promises = ((): { promise: Promise<any>, resolve: Function, reject: Function } => {
            const p: { promise: Promise<any>, resolve: Function, reject: Function } = <any>{};

            p.promise = new Promise<any>((resolve: Function, reject: Function) => {
                p.resolve = () => {
                    resolve();
                };
                p.reject = (e) => {
                    reject(e);
                };
            });

            return p;
        })();

        this.start = promises.resolve;
        this.fail = promises.reject;
        this._chain = promises.promise;
    }

    run(): ChainedPromiseEventEmitter {
        this.start();

        return this;
    }

    promise() {
        return this._chain;
    }

}
