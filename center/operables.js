const operables = {
  required: list(`
    create users
    read users
    update users
    delete users
    check users
    register users
    authorize users
  `),

  hardcodeRAM: list(`
    read users
    create users
  `),

  localStorage: list(`
    read users
    create users
  `),

  globalVault: list(`
    read users
    create users
  `),

  backOperations: list(`
    read users
    create users
  `),

  mongoDB: list(`
    read users
    create users
  `),

  mySQL: list(`
    read users
    create users
  `),
}


export default operables


function list(multiline) {
  return multiline.split(/\n */g).filter(line => line.trim())
}