# Information

Small contract which helps developers chain Promises with logging and event-emission.

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

# Installation

```bash
npm install --save @frenchex/chained-promise-event-emitter-lib
```
