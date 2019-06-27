/**
 * Thin wrapper around idb to use as redux-persist storage using single object store for all data
 * @see https://github.com/jakearchibald/idb
 * Must implement methods:
 * - getItem(key)
 * - setItem(key, item)
 * - removeItem(key)
 * - getAllKeys() required for Redux Persit v4
 */
import { openDb } from 'idb'

export default function createIdbStorage(options = {}) {
  /** @var {Object} */
  options = {
    /** Database name */
    name: 'keyval-store',
    /** Store name */
    storeName: 'keyval',
    /** Database version */
    version: 1,
    /** Upgrade callback. Useful when for example switching storeName */
    upgradeCallback: upgradeDb =>
      upgradeDb.createObjectStore(options.storeName),
    /** Custom options */
    ...options
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
    async getItem(key) {
      const db = await dbPromise
      const tx = db.transaction(options.storeName)

      return tx.objectStore(options.storeName).get(key)
    },

    /**
     * Set
     * @param {string} key
     * @param {*} item
     * @return {Promise}
     */
    async setItem(key, item) {
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
    async removeItem(key) {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      tx.objectStore(options.storeName).delete(key)

      return tx.complete
    },

    /**
     * Get all keys
     * @return {Promise}
     */
    async getAllKeys() {
      const db = await dbPromise
      const tx = db.transaction(options.storeName)

      return tx.objectStore(options.storeName).getAllKeys()
    },

    /**
     * Get all data
     * @return {Promise}
     */
    async getAll() {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      return tx.objectStore(options.storeName).getAll()
    },

    /**
     * Clear storage
     * @return {Promise}
     */
    async clear() {
      const db = await dbPromise
      const tx = db.transaction(options.storeName, 'readwrite')

      tx.objectStore(options.storeName).clear()

      return tx.complete
    }
  }
}
