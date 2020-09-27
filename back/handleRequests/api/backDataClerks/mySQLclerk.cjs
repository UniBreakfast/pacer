const {createConnection} = require('mysql')

const {PG_MYSQL_HOST, PG_DB_NAME, PG_DB_USER, PG_DB_PASS} = process.env

const uri = `mysql://${PG_DB_USER}:${PG_DB_PASS}@${
                    PG_MYSQL_HOST}/${PG_DB_NAME}`
let defaults, connection
connect()

const Connection = connection.constructor
const query = Connection.prototype.query

Connection.prototype.query = function (sql, callback) {
  if (sql && callback) return query.call(this, sql, callback)

  return new Promise((resolve, reject) => {
    query.call(this, sql, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}


const clerk = {
  async read(subject) {
    try {
      return await connection.query(`SELECT * FROM \`${subject}\``)
    } catch (err) {
      if (err.code == 'ER_NO_SUCH_TABLE') return defaults[subject]
      else throw err
    }
  },
}


module.exports = function getExported(defaultValues) {
  defaults = defaultValues
  return [operate, close]
}


async function operate(action, subject, data, lastTry) {
  try {
    if (connection.state == 'disconnected') throw null
    return await clerk[action](subject, data)
  } catch (err) {
    if (err != null) console.error(err.code == 'ECONNRESET' ?
                                    'MySQL connection reset' : err)
    if (lastTry) throw err

    await connect()
    return operate(action, subject, data, lastTry=true)
  }
}
// TODO Promisify this via events?
function connect() {
  return new Promise((resolve, reject) => {
    connection = createConnection(uri)
    connection.connect(err => {
      if (err) reject(err)
      resolve()
    })
  })

}

function close() {
  try { connection.end() } catch {}
}
