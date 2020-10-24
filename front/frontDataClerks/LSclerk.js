import defaults from '/center/defaultSubjectData.js'

import {rndStrDashed} from '/center/rndStr.js'


const {stringify, parse} = JSON,  cloneViaJSON = data => parse(stringify(data))

const assureArr = value => Array.isArray(value)? value : [value]

const ls = localStorage


const clerk = {
  read(subject) {
    try { return parse(ls['PG_'+subject]) }
    catch { return defaults[subject] }
  },

  create(subject, dataToAdd=[]) {
    const data = this.read(subject)

    dataToAdd = cloneViaJSON(assureArr(dataToAdd))

    dataToAdd.forEach(item => {
      if (!item.id) item.id = giveId()
      if (!item.created || !item.modified) {
        const date = new Date
        if (!item.created) item.created = date
        if (!item.modified) item.modified = date
      }
    })

    ls['PG_'+subject] = stringify(data.concat(dataToAdd))

    return dataToAdd.map(item => item.id)
  },

  authorize(_, {login, password}) {
    const users = ls.PG_users? parse(ls.PG_users) : []
    const user =
      users.find(user => user.login == login && user.password == password)
    if (user) {
      const token = rndStrDashed()
      user.token = token
      ls.PG_users = stringify(users)
      return token
    } else return false
  },

  verify(_, {login, token}) {
    const users = ls.PG_users? parse(ls.PG_users) : []
    return !!users.find(user => user.login == login && user.token == token)
  }
}


export default async function operate(action, subject, data) {
  return clerk[action](subject, data)
}


function giveId() {
  return ls.PG_lastId = ls.PG_lastId?
                        +ls.PG_lastId+1 : defaults.lastId
}