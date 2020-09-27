import {createServer} from 'http'
import handleRequest from './handleRequests/handleRequest.js'

// bounce required in order for the top level require(config) to be done first
setImmediate(() => {

  const port = process.env.PORT || 3000
  const dev = process.env.PG_DEV_MODE

  createServer(handleRequest).listen(port, () => {
    console.clear()
    console.info(`Server started${dev? ` at http://localhost:${port}` : ''}`)
  })

})