// Storage polyfill — mimics Claude's window.storage API using localStorage
// so the app works identically outside the artifact environment.

const storageShim = {
  async get(key) {
    const val = localStorage.getItem(`gatl:${key}`);
    if (val === null) throw new Error('Key not found');
    return { key, value: val, shared: false };
  },
  async set(key, value) {
    localStorage.setItem(`gatl:${key}`, value);
    return { key, value, shared: false };
  },
  async delete(key) {
    const existed = localStorage.getItem(`gatl:${key}`) !== null;
    localStorage.removeItem(`gatl:${key}`);
    return { key, deleted: existed, shared: false };
  },
  async list(prefix = '') {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('gatl:')) {
        const clean = k.slice(5);
        if (!prefix || clean.startsWith(prefix)) keys.push(clean);
      }
    }
    return { keys, prefix, shared: false };
  },
};

// Only install if window.storage doesn't already exist (i.e. not in Claude artifact)
if (!window.storage) {
  window.storage = storageShim;
}

export default storageShim;
