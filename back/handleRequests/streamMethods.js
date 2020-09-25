import Stream from 'stream'

import {fs, stat, mkdir} from '../backFS.js'

Stream.prototype.receiveToString = function (parts = []) {
  return new Promise((resolve, reject) => this
    .on('data', part => parts.push(part))
    .on('end', () => resolve(Buffer.concat(parts).toString('utf8')))
    .on('error', reject))
}

Stream.prototype.pipeIntoFile = function (path) {
  path = path.replace(/^\/|\/$/g, '')
  const dir = path.replace(/(^|\/)[^\/]*$/, '')
  return new Promise(async (resolve, reject)=> {
    try {
      const stats = await stat(path).catch(_=>{})
      if (stats && stats.isDirectory()) throw 0
      if (dir) await mkdir(dir)
      this.on('end', resolve).on('error', reject)
        .pipe(fs.createWriteStream(path))
    } catch (err) { reject(err) }
  })
}