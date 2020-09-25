import fs from 'fs'
import { ServerResponse } from 'http'

import './streamMethods.js'
import typeDict from './typeDict.js'
import handleAPI from './api/handleAPI.js'
import handleFSaccess from './handleFSaccess.js'

const fsp = fs.promises,  {stat} = fsp
const { stringify } = JSON

ServerResponse.prototype.json = function (obj) {
  this.setHeader('Content-Type', typeDict['json'])
  this.end(stringify(obj))
}


export default async function handleRequest(req, resp) {
  let {method} = req,  url = decodeURI(req.url)

  if (url.startsWith('/api/')) {
    req.url = url.slice(5)
    handleAPI(req, resp)
  }

  else if (url.startsWith('/writable/')) {
    req.url = '/center'+url
    handleFSaccess(req, resp)
  }

  else if (method == 'GET') {

    try {
        let path = process.cwd()+(url.startsWith('/center/')? '' : '/front')+url
        if ((await stat(path).catch(_=> stat(path+='.html'))).isDirectory() &&
          (await stat(path+='/index.html')).isDirectory())  throw 0
        const match = path.match(/\.(\w+)$/), ext = match? match[1] : 'html'

        fs.createReadStream(path).pipe(resp)
        if (typeDict[ext])
          resp.setHeader('Content-Type', typeDict[ext])

    } catch (err) {
      console.error(err)

      assign(resp, {statusCode:404}).json('sorry, '+url+' is not available')
    }
  }

  else resp.end(stringify({url, method}))
}