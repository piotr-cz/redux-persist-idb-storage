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

/** Options */
interface IOptions {
  /** Database name */
  name: string,
  /** Store name */
  storeName: string,
  /** Database version */
  version: number,
  /** Upgrade callback. Useful when for example switching storeName */
  upgradeCallback: (upgradeDB: UpgradeDB) => ObjectStore<any, string>,
}

export default function createIdbStorage(definedOptions: Partial<IOptions> = {}) {
  const options: IOptions = {
    name: 'keyval-store',
    storeName: 'keyval',
    version: 1,
    upgradeCallback: (upgradeDb: UpgradeDB) =>
      upgradeDb.createObjectStore(options.storeName),
    ...definedOptions,
  }

  const dbPromise = openDb(
    options.name,
    options.version,
    options.upgradeCallback
  )

  return {
    /**
     * Get
     */
    async getItem(key: string): Promise<any> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName)

      return tx.objectStore(options.storeName).get(key)
    },

    /**
     * Set
     */
    async setItem(
      key: string,
      item: any
    ): Promise<void> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      tx.objectStore(options.storeName).put(item, key)

      return tx.complete
    },

    /**
     * Remove
     */
    async removeItem(key: string): Promise<void> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      tx.objectStore(options.storeName).delete(key)

      return tx.complete
    },

    /**
     * Get all keys
     */
    async getAllKeys(): Promise<string[]> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName)

      return tx.objectStore(options.storeName).getAllKeys()
    },

    /**
     * Get all data
     */
    async getAll(): Promise<any[]> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName)

      return tx.objectStore(options.storeName).getAll()
    },

    /**
     * Clear storage
     */
    async clear(): Promise<void> {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      tx.objectStore(options.storeName).clear()

      return tx.complete
    },
  }
}
