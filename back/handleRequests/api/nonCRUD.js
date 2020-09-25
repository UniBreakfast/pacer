import {dataClerks, assignDataClerk} from './backOperate.js'

export default {
  db_in_use(_, resp) {
    resp.end(process.env.PG_DB_IN_USE)
  },
  use_db(_, resp, {clerkName, permissionKey}) {
    if (permissionKey == process.env.PG_ADMIN_KEY && clerkName in dataClerks) {
      assignDataClerk(clerkName)
      resp.end(`Granted. Server switched to ${clerkName}`)
    } else {
      resp.statusCode = 403
      resp.end('Denied. Incorrect permission key or unavailable clerk')
    }
  },
}