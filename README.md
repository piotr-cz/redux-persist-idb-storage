# Redux Persist adapter for IndexedDB storage

Storage adapter to use [IndexedDB](https://developer.mozilla.org/en-US/docs/Glossary/IndexedDB) via [idb](https://www.npmjs.com/package/idb) v3 with [redux-persist](https://github.com/rt2zz/redux-persist) ripped from [idb v3 docs > Examples](https://github.com/jakearchibald/idb/tree/v3.0.0#keyval-store) section


## Installation

Using npm:

```sh
npm install --save @piotr-cz/redux-persist-idb-storage
```

or Yarn:

```sh
yarn add @piotr-cz/redux-persist-idb-storage
```


## Requirements

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) support/ polyfill


## Setup

Import the storage and include it in `persistConfig` when creating Redux store:

```js
// configureStore.js

import createIdbStorage from '@piotr-cz/redux-persist-idb-storage'

const persistConfig = {
  key: 'root',
  storage: createIdbStorage({name: 'myApp', storeName: 'keyval'}),
  serialize: false, // Data serialization is not required and disabling it allows you to inspect storage value in DevTools
}

// ...
```

### Server-Side Rendering

When using Server-Side Rendering (SSR), indexedDB won't be available in the environment.

In this case you may use feature detection with a fallback to use default redux-persist storage (which resolves to [noop](https://github.com/rt2zz/redux-persist/blob/d7efde9115a0bd2d6a0309ac6fb1c018bf06dc30/src/storage/getStorage.js#L42) functions):

```js
// configureStore.js

// Redux Persist storage
import defaultStorage from 'redux-persist/lib/storage'

// IndexedDB storage
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage/src'

const persistConfig = {
  key: 'root',
  storage: globalThis.indexedDB ? createIdbStorage({name: 'myApp', storeName: 'keyval'}) : defaultStorage,
  serialize: false, 
}
```


### Options

See [idb API](https://github.com/jakearchibald/idb/tree/v3.0.2#api)

- `name` (optional): IndexedDB Database name. Defaults to `'keyval-store'`.
- `storeName` (optional): IndexedDB Store name. Defaults to `'keyval'`.
- `version` (optional): Schema version. Defaults to `1`.
- `upgradeCallback` (optional): Defaults to `upgradeDb => upgradeDb.createObjectStore(options.storeName)`.


## Notes

- idb dependency is locked to version ^3.0.0 as [4+ uses](https://github.com/jakearchibald/idb/blob/v4.0.3/changes.md#new-stuff) [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) which are not supported in older browsers
- credits go to [idb](https://github.com/jakearchibald/idb) authors
