import { createRequire } from 'module'
const require = createRequire(import.meta.url)

try { require('./config.cjs') }
catch { console.warn("No config.cjs found in root. It's ok if you have all appropriate system variables set. Otherwise you supposed to create a config.сjs by the config_template.cjs example you have in root.") }

import './back/server.js'

import expert from './center/expert.js'