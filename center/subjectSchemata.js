function produceSchemata(variant) {
  const id = variant == 'hex'? hexIdRule : variant == 'num'? numIdRule : idRule
  return {
    users: {
      id,
      login: loginRules,
      password: passRules,
      hash: {is: /^.{0,128}$/, issue: "maximum 128 characters long"},
      created: dateRule,
      modified: dateRule,
    },
    registrants: {
      login: loginRules,
      password: passRules,
      confirm: [],
    },
    visitors: {
      login: loginRules,
      password: passRules,
    }
  }
}


const idRule = [
  {conditions: [/\d/, /^[^a-f]+$/], is: /^\d+$/,
    issue: "if it's a number it should be a positive integer"},
  {condition: /[a-f]/, is: /^[\da-f]+$/,
    issue: "hexadecimals should not contain non-digit characters"},
  {condition: /[a-f]/, is: /^[\da-f]{24}$/,
    issue: "if it's a hexadecimal it should be 24 characters long"},
  {not: /^[^\da-f]+$/, issue: "only numbers, hexadecimals or empty"}
]

const numIdRule = {is: /^\d*$/, issue: "only positive integer decimal numbers" }

const hexIdRule = [
  {is: /^[\da-f]*$/, issue: "only hexadecimal digit characters"},
  {condition: /[\da-f]/, is: /^[\da-f]{24}$/,
    issue: "should be 24 characters long"},
]

const loginRules = [
  {condition: /./, is: /^[\w\s]+$/, issue: "should be alphanumeric"},
  {is: /^.{3,32}$/, issue: "has to be 3 to 32 characters long"},
  {condition: /./, hasNo: /^[\d_]/, issue: "should start with a letter"},
  {hasNo: / /, issue: "spaces are not allowed"}
]

const passRules = [
  {is: /^.{5,128}$/, issue: "has to be 5 to 128 characters long"},
  {hasNo: /\s/, issue: "spaces are not allowed"}
]

const dateRule = {is: /^$|^\d{4}-\d\d-\d\d((T| )\d\d:\d\d(:\d\d)?)?$/,
issue: "if not empty should have a date/datetime format"}



export default {
  generic: produceSchemata(),
  hex: produceSchemata('hex'),
  num: produceSchemata('num')
}
