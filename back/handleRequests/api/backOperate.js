import fs from 'fs'
const fsp = fs.promises

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import operables from '../../../center/operables.js'
import defaults from '../../../center/defaultSubjectData.js'


export const dataClerks = {
  mongoDB: () => require('./backDataClerks/mongoDBclerk.cjs')(defaults),
  mySQL: () => require('./backDataClerks/mySQLclerk.cjs')(defaults),
}

let operateViaDC, fireOldDC

// bounce required in order for the top level require(config) to be done first
setImmediate(assignDataClerk)


export async function assignDataClerk(clerkName) {
  if (clerkName) {
    if (clerkName == process.env.PG_DB_IN_USE) return

    if (! (clerkName in dataClerks))
      return console.error('Unknown data clerk name')

    process.env.PG_DB_IN_USE = clerkName

    updateConfig(clerkName)

    await fireOldDC()
  }

  if (!process.env.PG_DB_IN_USE)
    process.env.PG_DB_IN_USE = Object.keys(dataClerks)[0]

  ;[operateViaDC, fireOldDC] = dataClerks[process.env.PG_DB_IN_USE]()
}


export async function operate(action, subject, data, credentials) {
  const operation = action+' '+subject
  if (!operables.required.includes(operation))
    throw `unsupported operation '${operation}'`

  const clerkName = process.env.PG_DB_IN_USE
  if (!operables[clerkName].includes(operation))
    throw `operation '${operation}' is not supported by ${clerkName} clerk`

  if (!operateViaDC) await assignDataClerk()
  return await operateViaDC(action, subject, data)
}


async function updateConfig(clerkName) {
  const path = process.cwd()+'/config.cjs'
  try {
    const config = String(await fsp.readFile(path))
    await fsp.writeFile(path, config
                    .replace( /(PG_DB_IN_USE: ')\w*(',)/ , `$1${clerkName}$2`))
  } catch {}
}