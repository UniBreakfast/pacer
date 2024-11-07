// MDS stands for "multiple datasources" - the name/purpose of this project
Object.assign(process.env, {
  PG_DEV_MODE: true,
  PG_ADMIN_KEY: 'PG_permission_key',
  PG_DB_IN_USE: 'mySQL',
  PG_MONGO_HOST: 'PG_claster_address',
  PG_MYSQL_HOST: 'PG_mysql_address',
  PG_DB_NAME: 'PG_db_name',
  PG_DB_USER: 'PG_admin_name',
  PG_DB_PASS: 'PG_correct_password',
  PG_TELEGRAM_TOKEN: 'PG_admin_telegram_token',
  PG_ADMIN_CHAT: 'PG_admin_telegram_id',
})
