import fs from 'fs'
const fsp = fs.promises

import { createRequire } from 'module'
const require = createRequire(import.meta.url)



export const dataClerks = {
  mongoDB: () => require('./backDataClerks/mongoDBclerk.cjs'),
  mySQL: () => require('./backDataClerks/mySQLclerk.cjs'),
}

let operateViaDC, fireOldDC

// bounce required in order for the top level require(config) to be done first
setImmediate(assignDataClerk)


export async function assignDataClerk(clerkName) {
  if (clerkName) {
    if (clerkName == process.env.PG_db_in_use) return

    if (! (clerkName in dataClerks))
      return console.error('Unknown data clerk name')

    process.env.PG_db_in_use = clerkName

    updateConfig(clerkName)

    await fireOldDC()
  }

  if (!process.env.PG_db_in_use)
    process.env.PG_db_in_use = Object.keys(dataClerks)[0]

  ;[operateViaDC, fireOldDC] = dataClerks[process.env.PG_db_in_use]()
}


export function operate(action, subject, data, credentials) {
  return operateViaDC(action, subject, data)
}


async function updateConfig(clerkName) {
  const path = process.cwd()+'/config.cjs'
  try {
    const config = String(await fsp.readFile(path))
    await fsp.writeFile(path, config
                    .replace( /(PG_DB_IN_USE: ')\w*(',)/ , `$1${clerkName}$2`))
  } catch {}
}