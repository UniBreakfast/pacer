import fs from 'fs'
import { ServerResponse } from 'http'

import './streamMethods.js'
import typeDict from './typeDict.js'
import handleAPI from './api/handleAPI.js'
import handleFSaccess from './handleFSaccess.js'

const fsp = fs.promises,  {stat} = fsp
const { stringify } = JSON
const { assign } = Object

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
        const fsItem = await stat(path).catch(() => stat(path+='.html'))
          .catch(() => { throw `"${path.slice(0, -5)}" not found` })
        if (fsItem.isDirectory()) {
          const page = await stat(path+='/index.html')
            .catch(() => { throw `"${path}" not found` })
          if (page.isDirectory())  throw `"${path}" is not a file`
        }
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