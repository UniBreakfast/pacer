import querystring from 'querystring'

export default function presentData(reqBody, urlPart) {
  if (typeof reqBody == 'string' && reqBody.length || Array.isArray(reqBody))
    return reqBody
  if (typeof reqBody.data=='string' && reqBody.data.length ||
    Array.isArray(reqBody.data))  return reqBody.data

  const data = {}

  if (typeof urlPart=='string' && urlPart.length>2 && urlPart.startsWith('?')) {
    Object.assign(data, querystring.parse(urlPart.slice(1)))
  }

  if (reqBody.data)  Object.assign(data, reqBody.data)
  else if (reqBody) {
    for (const key in reqBody) {
      if (!['credentials', 'login', 'token'].includes(key))
        data[key] = reqBody[key]
    }
  }

  return data
}