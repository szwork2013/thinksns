class Cache
{
  static getAll() {
    return this.store;
  }

  static getItem(key) {
    if (this.store.hasOwnProperty(key)) {
      return this.store[key];
    }

    return null;
  }

  static setItem(key, value) {
    return this.store[key] = value;
  }

  static removeItem(key) {
    if (this.store.hasOwnProperty(key)) {
      this.store[key] = undefined;
    }
  }

  static hasItem(key) {
    if (this.store.hasOwnProperty(key)) {
      return true;
    }
    return false;
  }

}

Cache.store = {};

export default Cache;
