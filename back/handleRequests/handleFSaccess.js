import { fs, ops, stat, remove, explore, scout } from '../backFS.js'

import typeDict from './typeDict.js'

const {parse} = JSON,  {assign} = Object


export default async function handleFSaccess(req, resp) {
  let {method, url} = req

  if (method == 'GET') {

    try {

      const scope = url.match(/([^?]*)(\?\??)(\d*)$/)

      if (scope) {
        const [, url, questionMarks, depth] = scope
        const action = questionMarks == '??' ? explore : scout
        resp.json(await action(process.cwd()+url, ...depth? [+depth]:[]))
      }

      else {
        let path = process.cwd()+url
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
      }

    } catch (err) {
      console.error(err)

      assign(resp, {statusCode:404}).json('sorry, '+url+' is not available')
    }
  }

  else if (method == 'POST') {

    const {op, args} = parse(await req.wait())

    try {
      await ops[op](...args).then(()=> resp.end('ok'))
    } catch {
      assign(resp, {statusCode:400}).end(op+' operation failed')
    }
  }

  else if (method == 'PUT') {
    req.pipeIntoFile(url).then(()=> resp.end('ok'))
      .catch(err => {
        console.error(err)
        assign(resp, {statusCode:409}).end('write error')
      })
  }

  else if (method == 'DELETE') {
    remove(process.cwd()+url).then(()=> resp.end('ok'))
  }

}