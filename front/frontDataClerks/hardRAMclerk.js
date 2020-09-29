import * as data from '/center/data.js'
import defaults from '/center/defaultSubjectData.js'

const {stringify, parse} = JSON,  cloneViaJSON = data => parse(stringify(data))

const assureArr = value => Array.isArray(value)? value : [value]


const clerk = {
  read(subject) {
    return cloneViaJSON(data[subject] || defaults[subject])
  },

  create(subject, dataToAdd=[]) {
    dataToAdd = cloneViaJSON(assureArr(dataToAdd))

    if (!data[subject]) data[subject] = defaults[subject]


    dataToAdd.forEach(item => {
      if (!item.id) item.id = giveId()
      if (!item.created || !item.modified) {
        const date = new Date
        if (!item.created) item.created = date
        if (!item.modified) item.modified = date
      }
    })

    data[subject].push(...dataToAdd)

    return dataToAdd.map(item => item.id)
  }
}


export default async function operate(action, subject, data) {
  return clerk[action](subject, data)
}

function giveId() {
  return data.lastId.value = data.lastId.value?
                  data.lastId.value+1 : defaults.lastId
}