/**
 * Thin wrapper around idb to use as redux-persist storage using single object store for all data
 * @see https://github.com/jakearchibald/idb
 * Must implement methods:
 * - getItem(key)
 * - setItem(key, item)
 * - removeItem(key)
 * - getAllKeys() required for Redux Persit v4
 */
import { openDb, UpgradeDB, ObjectStore } from 'idb'

export default function createIdbStorage(
  definedOptions: {
    name?: string
    storeName?: string
    version?: number
    upgradeCallback?: (upgradeDB: UpgradeDB) => ObjectStore<any, any>
  } = {}
) {
  /** @var {Object} */
  const options = {
    /** Database name */
    name: 'keyval-store',
    /** Store name */
    storeName: 'keyval',
    /** Database version */
    version: 1,
    /** Upgrade callback. Useful when for example switching storeName */
    upgradeCallback: (upgradeDb: UpgradeDB) =>
      upgradeDb.createObjectStore(options.storeName),
    /** Custom options */
    ...definedOptions,
  }

  /** @var {Promise} */
  const dbPromise = openDb(
    options.name,
    options.version,
    options.upgradeCallback
  )

  return {
    /**
     * Get
     * @param {string} key
     * @return {Promise}
     */
    async getItem(key: string): Promise<any> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName)

      return tx.objectStore(options.storeName).get(key)
    },

    /**
     * Set
     * @param {string} key
     * @param {string | number | IDBKeyRange | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | undefined} item
     * @return {Promise}
     */
    async setItem(
      key: string,
      item:
        | string
        | number
        | IDBKeyRange
        | Date
        | ArrayBufferView
        | ArrayBuffer
        | IDBArrayKey
        | undefined
    ): Promise<any> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      tx.objectStore(options.storeName).put(item, key)

      return tx.complete
    },

    /**
     * Remove
     * @param {string} key
     * @return {Promise}
     */
    async removeItem(key: string): Promise<any> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      tx.objectStore(options.storeName).delete(key)

      return tx.complete
    },

    /**
     * Get all keys
     * @return {Promise}
     */
    async getAllKeys(): Promise<any> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName)

      return tx.objectStore(options.storeName).getAllKeys()
    },

    /**
     * Get all data
     * @return {Promise}
     */
    async getAll(): Promise<any> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      return tx.objectStore(options.storeName).getAll()
    },

    /**
     * Clear storage
     * @return {Promise}
     */
    async clear(): Promise<any> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      tx.objectStore(options.storeName).clear()

      return tx.complete
    },
  }
}
