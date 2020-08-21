const fs = require('fs');
const path = require('path');

const ENOENT = 'ENOENT';

//------------------------------------------------------------------------------
// PUBLIC
//------------------------------------------------------------------------------

async function deleteDirectory(dir) {
  const type = typeof dir;
  if (type !== 'string') {
    throw new Error(`Expected a string argument. Received ${type} instead.`);
  }
  let entries = await readdir(dir);
  for (let entry of entries) {
    const pathname = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await deleteDirectory(pathname);
    } else {
      await unlink(pathname);
    }
  }
  await rmdir(dir);
}

//------------------------------------------------------------------------------
// PRIVATE
//------------------------------------------------------------------------------

function readdir(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, { withFileTypes: true }, (err, files) => {
      if (err) {
        if (err.code === ENOENT) {
          resolve([]);
        } else {
          reject(err);
        }
      } else {
        resolve(files);
      }
    });
  });
}

function rmdir(path) {
  return new Promise((resolve, reject) => {
    fs.rmdir(path, err => {
      if (err) {
        if (err.code === ENOENT) {
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve();
      }
    });
  });
}

function unlink(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

//------------------------------------------------------------------------------
// EXPORTS
//------------------------------------------------------------------------------

module.exports = deleteDirectory;
