/*global chrome*/
import Promise from 'bluebird';
import {Buffer} from 'buffer';

const MAX_CHUNK_LENGTH = 2000;

function split(buf) {
  var view = new Uint8Array(buf);
  var chunks = [];
  var viewIndex = 0;

  while(viewIndex < view.length) {
    var chunkLength = Math.min(view.length - viewIndex, MAX_CHUNK_LENGTH);
    var sub = view.subarray(viewIndex, viewIndex + chunkLength);
    viewIndex += chunkLength;
    chunks.push(Array.from(sub));
  }

  return chunks;
}

export function save(file) {
  let chunks = split(file.content);
  let opts = {};
  chunks.forEach((chunk, idx) => {
    opts['db'+idx] = chunk;
  });

  opts.dbLength = chunks.length;
  opts.dbName = file.name;

  console.log(opts);

  return new Promise((resolve, reject) => {
    chrome.storage.local.set(opts, () => {
      if(chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      resolve();
    });
  })
}

function getStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (res) => {
      if(chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
      console.log('getStorage', key, '=>', res);
      if(typeof key === 'string') resolve(res[key]);
      else resolve(res);
    });
  })
}

export function load() {
  return getStorage(['dbLength', 'dbName'])
    .then(({ dbLength, dbName = 'keepass.kdbx' }) => {
      if(dbLength) {
        let keys = [];
        while(dbLength--) {
          keys.push('db'+dbLength);
        }

        return getStorage(keys)
          .then(opts => {
            let length = keys.length;
            let chunks = [];
            while(length--) {
              chunks.unshift(new Buffer(opts['db'+length]));
            }
            return { name: dbName, content: Buffer.concat(chunks) };
          })
      }
    })
}

export function clean() {
  return getStorage('dbLength')
    .then(length => {
      if(length != null) {
        let keys = ['dbLength', 'dbName'];
        while(length--) {
          keys.push('db'+length);
        }
        return new Promise((resolve, reject) => {
          chrome.storage.local.remove(keys, () => {
            if(chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
            resolve();
          });
        })
      }
    })
}
