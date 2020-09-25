import * as data from '/center/data.js'

const {stringify, parse} = JSON,  cloneViaJSON = data => parse(stringify(data))

const clerk = {
  read(subject) {
    return cloneViaJSON(data[subject])
  }
}


export default function operate(action, subject, data) {
  return Promise.resolve(clerk[action](subject, data))
}