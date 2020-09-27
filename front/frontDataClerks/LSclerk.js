import defaults from '/center/defaultSubjectData.js'

const {stringify, parse} = JSON



const clerk = {
  read(subject) {
    try { return parse(localStorage['PG_'+subject]) }
    catch { return defaults[subject] }
  }
}


export default async function operate(action, subject, data) {
  return clerk[action](subject, data)
}