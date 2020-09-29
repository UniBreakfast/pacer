import defaults from '/center/defaultSubjectData.js'

const {stringify, parse} = JSON,  cloneViaJSON = data => parse(stringify(data))

const assureArr = value => Array.isArray(value)? value : [value]


const clerk = {
  read(subject) {
    try { return parse(localStorage['PG_'+subject]) }
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

    localStorage['PG_'+subject] = stringify(data.concat(dataToAdd))

    return dataToAdd.map(item => item.id)
  },
}


export default async function operate(action, subject, data) {
  return clerk[action](subject, data)
}


function giveId() {
  return localStorage.PG_id = localStorage.PG_id? +localStorage.PG_id+1 : 999
}