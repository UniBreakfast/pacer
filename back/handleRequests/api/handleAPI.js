import {operate} from './backOperate.js'

import presentData from './presentData.js'
import presentCredentials from './presentCredentials.js'
import nonCRUD from './nonCRUD.js'



export default async function handleAPI(req, resp) {
  const { url, method } = req

  let reqBody = await req.receiveToString()
  try { reqBody = JSON.parse(reqBody) } catch {}

  if (nonCRUD[url]) {
    return nonCRUD[url](req, resp, reqBody)
  }

  const urlParts = url.split(/\/|\b(?=\?[^?&])/)

  const action = reqBody.action || urlParts[0]
  const subject = reqBody.subject || urlParts[1]
  const data = presentData(reqBody, urlParts[2])
  const credentials = presentCredentials(req, reqBody, data)

  try {
    resp.json(await operate(action, subject, data, credentials))
  } catch (err) {
    console.error(err)

    resp.statusCode = 417
    resp.json('API worked fine... until it didn\'t... ' +
              'I really hope it wasn\'t too important')
  }
}
