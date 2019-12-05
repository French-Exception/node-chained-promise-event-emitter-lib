# Installation

```bash
npm install --save @frenchex/chained-promise-event-emitter-lib
```

# Information

Small contract which helps developers chain Promises with logging and event-emission.

# Usage example

```typescript
import * as log4j from '@log4js-node/log4js-api';
import {ChainedPromiseEventEmitter} from "@frenchex/chained-promise-event-emitter-lib";

$logger = log4js.getLogger('my-app-main-promise');
$cP = new ChainedPromiseEventEmitter($logger);

$cP
.chain('init.config.init', initConfigInit /** returns a Promise **/)
.chain('init.config.load', initConfigLoad /** returns a Promise **/)
.chain('init.rc.load',     initRcLoad     /** returns a Promise **/)
.run()
```

# Testing

Testing code is offloaded into another NPM package.

```bash
mkdir chained-promise-event-emitter-lib-test
cd chained-promise-event-emitter-lib-test
npm init -f
npm i --save @frenchex/chained-promise-event-emitter-lib-test
cd node_modules/@frenchex/chained-promise-event-emitter-lib
npm run test
```
