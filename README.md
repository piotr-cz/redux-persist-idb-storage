# Redux Persist adapter for IndexedDB storage

Storage adapter to use [IndexedDB](https://developer.mozilla.org/en-US/docs/Glossary/IndexedDB) via [idb](https://www.npmjs.com/package/idb) v3 with [redux-persist](https://github.com/rt2zz/redux-persist) ripped from [idb docs > Examples](https://github.com/jakearchibald/idb/tree/v3.0.0#keyval-store) section


## Installation

```sh
npm install --save @piotr-cz/redux-persist-idb-storage
```
or

```sh
yarn add @piotr-cz/redux-persist-idb-storage
```


## Requirements

- [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) support/ polyfill


## Setup

Import the storage and include it in `persistConfig` when creating Redux store:

```js
// configureStore.js

// using CommonJS modules
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage'

// using ES6 modules
import createIdbStorage from '@piotr-cz/redux-persist-idb-storage/src'

const persistConfig = {
  key: 'root',
  storage: createIdbStorage({name: 'myApp', storeName: 'keyval'}),
  serialize: false, // Data serialization is not required and disabling it allows you to inspect storage value in DevTools
}

// ...
```


### Options

See [idb API](https://github.com/jakearchibald/idb/tree/v3.0.2#api)

- _{string}_ **name** - Defaults to `keyval-store`
- _{string}_ **storeName** - Defaults to `keyval`
- _{number}_ **version** - Defaults to `1`
- _{function}_ **upgradeCallback** - Defaults to `upgradeDb => upgradeDb.createObjectStore(options.storeName)`


## Notes

- idb dependency is locked to version ^3.0.0 as [4+ uses](https://github.com/jakearchibald/idb/blob/v4.0.3/changes.md#new-stuff) [proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) which are not supported in older browsers
