const idRule = [
  {conditions: [/\d/, /^[^a-f]+$/], is: /^\d+$/,
    issue: "if it's a number it should be a positive integer"},
  {condition: /[a-f]/, is: /^[\da-f]+$/,
    issue: "hexadecimals should not contain non-digit characters"},
  {condition: /[a-f]/, is: /^[\da-f]{24}$/,
    issue: "if it's a hexadecimal it should be 24 characters long"},
  {not: /^[^\da-f]+$/, issue: "only numbers, hexadecimals or empty"}
]

const numIdRule = {is: /\d*/, issue: "only positive integers" }

const hexIdRule = [
  {is: /^[\da-f]+$/, issue: "only hexadecimal digit characters"},
  {condition: /[a-f]/, is: /^[\da-f]{24}$/,
    issue: "should be 24 characters long"},
]

const dateRule = {is: /^$|^\d{4}-\d\d-\d\d((T| )\d\d:\d\d(:\d\d)?)?$/,
issue: "if not empty should have a date/datetime format"}


function produceSchemata(variant) {
  const id = variant == 'front'? idRule :
    variant == 'mongo'? hexIdRule : numIdRule
  return {
    users: {
      id,
      login: [
        {condition: /./, is: /^[\w\s]+$/, issue: "should be alphanumeric"},
        {is: /^.{3,32}$/, issue: "has to be 3 to 32 characters long"},
        {condition: /./, hasNo: /^[\d_]/, issue: "should start with a letter"},
        {hasNo: / /, issue: "spaces are not allowed"}
      ],
      password: [
        {is: /^.{5,128}$/, issue: "has to be 5 to 128 characters long"},
        {hasNo: /\s/, issue: "spaces are not allowed"}
      ],
      hash: {is: /^.{0,128}$/, issue: "maximum 128 characters long"},
      created: dateRule,
      modified: dateRule,
    }
  }
}


export const frontSchemata = produceSchemata('front')
export const mongoSchemata = produceSchemata('mongo')
export const mysqlSchemata = produceSchemata('mysql')