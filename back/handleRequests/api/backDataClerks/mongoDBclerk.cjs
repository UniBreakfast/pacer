const { MongoClient } = require('mongodb')

const {PG_MONGO_HOST, PG_DB_NAME, PG_DB_USER, PG_DB_PASS} = process.env

const uri = `mongodb+srv://${PG_DB_USER}:${PG_DB_PASS}@${
                PG_MONGO_HOST}/${PG_DB_NAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

let defaults, client, pgDB

connect()


const clerk = {
  async read(db, subject) {
    return await db.collection(subject).find().toArray()
  },
}


module.exports = function getExported(defaultValues) {
  defaults = defaultValues
  return [operate, close]
}


async function operate(action, subject, data, lastTry) {
  try {
    if (!client.isConnected()) throw null
    const db = await pgDB

    global.db = db

    return await clerk[action](db, subject, data)

    if (`${action} ${subject}` == 'insert events') {
      const event = data
      ;['occurred','created','modified']
        .forEach(key => event[key] = new Date(event[key]))
      return await db.collection(subject).insertOne(event)
    }
  } catch (err) {
    if (err != null) console.error(err)
    if (lastTry) throw err

    await connect().catch(console.error)
    return operate(action, subject, data, lastTry=true)
  }
}


function connect() {
  return new Promise((resolve, reject) => {
    client = new MongoClient(uri, options)
    pgDB = client.connect().then(() => {
      resolve()
      return client.db(PG_DB_NAME)
    }).catch(reject)

    Object.assign(global, {client})
  })
}


async function close() {
  try { await client.close() } catch {}
}
