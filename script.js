import {resolveByHand} from './resolveByHand.js'


const dataSources = [
  ['Оперативная память и захардкоденные данные', 'hardcode'],
  ['LocalStorage', 'localStorage'],
  ['GlobalVault', 'globalVaults'],
  ['Mongo DB', 'mongoDB'],
  ['MySQL', 'MySQL']
]
let dataSource


chooseDataSource()

function beginAsVisitor() {
  resolveByHand('Решаем, это пользователь или гость', [
    ['Это пользователь, которого пэйсер узнал', beginAsUser],
    ['Это не пользователь, значит, гость', continueAsGuest],
  ])
}

function continueAsGuest() {
  resolveByHand('Гость выбирает, что будет делать', [
    'Почитает про систему Пэйсер', 'Почитает наши новости',
    ['Попробует зарегистрироваться', tryRegister],
    ['Попробует войти как пользователь', tryLogin],
  ])
}

function tryRegister(again) {
  if (!again) resolveByHand('Гость видит форму регистрации и...', [
    ['Регистрируется, идеально заполнив форму', askAboutGeneralConfidence],
    ['Неудачно заполняет форму регистрации', () => tryRegister('again')],
    ['Возвращается назад', continueAsGuest],
  ])
  else resolveByHand('Гость читает, какие ошибки возникли и...', [
    ['Регистрируется, исправив ошибки', askAboutGeneralConfidence],
    'Продолжает с ошибками',
    ['Возвращается назад', continueAsGuest],
  ])
}

function tryLogin(again) {
  resolveByHand(!again? 'Гость видит форму входа и...' :
    'Гость читает про ошибки и...', [
      ['Входит с правильными логином/паролем', beginAsUser],
      ['Вводит неправильные логин/пароль', () => tryLogin('again')],
      ['Пытается продолжить без логина/пароля', () => tryLogin('again')],
      ['Возвращается назад', continueAsGuest],
    ]
  )
}

function beginAsUser() {
  resolveByHand('Этот пользователь начал игру?', [
    ['Да, загрузить его данные', desideIfTutorialNeeded],
    ['Нет, начать сначала', askAboutGeneralConfidence],
  ])
}

function continueAsUser() {
  resolveByHand('Пользователь в главном меню. Он видит, сколько у него очков веры в себя, сколько отчётов по просроченным выполнениям по квестам от него ожидается, сколько квестов ещё ждут от него выполнения сегодня и сколько для него новых входящих сообщений. Также видны количества нереализованных стремлений и действий, незадействованных в текущих квестах. Кроме того пользователь видит никнэйм своего профиля, текущее время и время оставшееся до конца суток. Он решает...', [
    ['Посмотреть список стремлений', viewEndeavors],
    'Добавить новое стремление',
    'Посмотреть список действий',
    'Добавить новое действие',
    'Отчитаться по просроченным выполнениям',
    'Посмотреть квесты на сегодня',
    'Посмотреть список квестов',
    'Посмотреть календарь квестов',
    'Открыть таймлайн',
    'Посмотреть историю изменений веры в себя',
    'Посмотреть свой прогресс',
    'Искать (людей, стремления, действия)',
    'Перейти к сообщениям',
    'Открыть список друзей',
    'Зайти в профиль',
    ['Зайти в настройки', goToSettings],
    ['Выйти (как пользователь)', continueAsGuest],
  ], 700)
}

async function viewEndeavors() {
  const hasEndeavors = await resolveByHand('У пользователя есть неархивированные стремления?', [['Да', true], ['Нет', false]])

  const viewMode = await resolveByHand(
    'Пользователь выбирал режим представления стремлений?',
    [
      ['Нет', 'list'],  ['Да, последний раз выбрал список', 'list'],
      ['Да, последний раз выбрал таблицу', 'table'],
    ]
  )
  resolveByHand(`Пользователь видит ${viewMode=='list'? hasEndeavors?
    'список своих стремлений' : 'пустой список стремлений' : hasEndeavors?
      'таблицу со своими стремлениями' : 'пустую таблицу без стремлений'}`)
}

function desideIfTutorialNeeded() {
  resolveByHand('Встречать ли пользователя обучалкой-туториалом?', [
    ['Нет, он её прошёл ранее', continueAsUser],
    ['Нет, он от неё отказался', continueAsUser],
    ['Да, ему нужно всё объяснить', continueAsGuidedUser],
  ])
}

async function chooseDataSource(again) {
  if (!again && localStorage.PG_dataSource) {
    dataSource = localStorage.PG_dataSource
    beginAsVisitor()
    return
  }

  let choices = [...dataSources]
  let current = ''

  if (again) {
    const knownDS = dataSources.find(src => src[1]==dataSource)
    current = `Сейчас используется ${knownDS? knownDS[0] : dataSource}. При переключении на другой источник/хранилище данных приложение перезагрузится. `
    choices.push(['оставить текущее', goToSettings])
  }

  const choice = await resolveByHand(current +
    'Какой источник/хранилище данных использовать?', choices)

  if (choice) {
    dataSource = localStorage.PG_dataSource = choice
    if (again) location.reload()
    else beginAsVisitor()
  }
}

function askAboutGeneralConfidence() {
  resolveByHand('Спросить пользователя о его вере в себя', [
    ['Пользователь отвечает числом от 2 до 10', continueAsGuidedUser],
    ['Пользователь выходит', continueAsGuest],
  ])
}

async function continueAsGuidedUser() {
  const [hasEndeavors, hasActivities] = await resolveByHand(
    'Пользователь уже добавил действия и стремления?',
    [
      ['Нет', [false, false]],
      ['Да', [true, true]],
      ['Только действия', [false, true]],
    ]
  )

  const [hasQuests, timeToReport] = hasEndeavors && hasActivities?
    await resolveByHand('Пользователь уже взял квест(-ы)?', [
      ['Нет', [false, false]],
      ['Да', [true, false]],
      ['Да, и поскольку это уже не первый день, по каким-то из них пора отчитываться', [true, true]],
    ]
  ) : [false, false]

  resolveByHand(`Начинающий пользователь читает вводную, где ему предлагается ${
    !hasEndeavors || !hasActivities? 'начать с добавления стремлений и действий, и объясняется, что подразумевается, и зачем это нужно' :
      'продолжить, связывая стремления с действиями и беря квесты на добавленные действия'
  }.${hasQuests? ' Рядом показаны уже взятые квесты и, если какие-то из них на сегодня, то список тех, что должны сегодня выполняться.' : ''}${
    timeToReport? ' Сверху висит оповещение-напоминание отчитаться о просроченных выполнениях по квестам в уже прошедший день.' : ''
  } Он решает...`, [
    ['Добавить стремление', guidedAddEndeavor],
    ['Добавить действие', guidedAddActivity],
    [hasEndeavors && hasActivities,
      'Попробовать связать действия со стремлениями', guidedLinking],
    [hasActivities, 'Перейти к взятию квестов', guidedTakeQuest],
    [hasQuests,
      'Отметить какое-то из сегодняшних выполнений по квесту готовым'],
    [timeToReport, 'Отчитаться за прошедший день'],
    ['Отказаться от обучалки-туториала и перейти к полному интерфейсу',
      continueAsUser],
    ['Выйти (как пользователь)', continueAsGuest],
  ], 700)
}

async function guidedAddEndeavor() {
  const endeavorCount = await resolveByHand(
    'Этот пользователь уже добавлял стремления?',
    [
      ['Нет, ещё ни одного', 0],
      ['Да, одно-два', 2],
      ['Да, три или больше', 99],
    ]
  )
  const enoughActivities = endeavorCount < 3? false : await resolveByHand(
    'Этот пользователь уже добавил достаточно действий?',
    [
      ['Нет или меньше трёх', false],
      ['Да, три или больше', true],
    ]
  )
  const showBelow = endeavorCount<3? 'examples' : 'hint'
  const hint = showBelow!='hint'? '' : enoughActivities? 'теперь ему стоит попробовать связать какие-то из них с соответствующими им действиями или взять квест' : 'пока ему стоит добавить больше действий'

  resolveByHand(`Пользователь видит ${endeavorCount?
    'уже добавленное(-ые) стремление(-я), ' : ''}форму добавления нового стремления и ${!hint? 'примеры формулировок стремлений' :
      `подсказку, что стремлений пока достаточно, он сможет добавить потом другие, а ${hint}`}. Он...`, [
    ['Добавляет новое стремление', guidedAddEndeavor],
    [hint && !enoughActivities,
      'Переходит к добавлению действий', guidedAddActivity],
    [hint && enoughActivities,
      'Попробует связать стремления с действиями', guidedLinking],
    [hint && enoughActivities, 'Переходит к взятию квестов', guidedTakeQuest],
    ['Выходит в меню', continueAsGuidedUser],
  ])
}

async function guidedAddActivity() {
  const activityCount = await resolveByHand(
    'Этот пользователь уже добавлял действия?',
    [
      ['Нет, ещё ни одного', 0],
      ['Да, одно-два', 2],
      ['Да, три или больше', 99],
    ]
  )
  const enoughEndeavors = activityCount < 3? false : await resolveByHand(
    'Этот пользователь уже добавил достаточно стремлений?',
    [
      ['Нет или меньше трёх', false],
      ['Да, три или больше', true],
    ]
  )
  const showBelow = activityCount<3? 'examples' : 'hint'
  const hint = showBelow!='hint'? '' : enoughEndeavors? 'теперь ему стоит попробовать связать какие-то из них с соответствующими им стремлениями или взять квест' : 'пока ему стоит добавить больше стремлений'

  resolveByHand(`Пользователь видит ${activityCount?
    'уже добавленное(-ые) действие(-я), ' : ''}форму добавления нового действия и ${!hint? 'примеры формулировок действий' :
      `подсказку, что действий пока достаточно, он сможет добавить потом другие, а ${hint}`}. Он...`, [
    ['Добавляет новое действие', guidedAddActivity],
    [hint && !enoughEndeavors,
      'Переходит к добавлению стремлений', guidedAddEndeavor],
    [hint && enoughEndeavors,
      'Попробует связать действия со стремлениями', guidedLinking],
    [hint && enoughEndeavors, 'Переходит к взятию квестов', guidedTakeQuest],
    ['Выходит в меню', continueAsGuidedUser],
  ])
}

function guidedLinking() {
  resolveByHand('Пользователь видит свои стремления и действия бок о бок, и ему поясняется, что, по идее системы Пэйсер, действия ведут к реализации стремлений, и ожидается, что он свяжет соответствующие друг другу на этом экране. Если он какие-то уже связал, эти связи видны, и подсвечиваются при выделении какого-то из связанных стремлений или действий. Пользователь...',
  [
    'Связывает какое-то из стремлений с каким-то из действий',
    'Разрывает какую-то из ошибочно установленных связей',
    ['Переходит к добавлению стремлений', guidedAddEndeavor],
    ['Переходит к добавлению действий', guidedAddActivity],
    ['Переходит к взятию квестов', guidedTakeQuest],
    ['Выходит в меню', continueAsGuidedUser],
  ], 600)
}

async function guidedTakeQuest(again) {
  const enoughConfidence = await resolveByHand('Пользователю хватает очков веры в себя на квест хотя бы на один день хотя бы на одно из добавленных им действий с учётом их сложности?', [['Да', true], ['Нет', false]])

  if (enoughConfidence)  resolveByHand('Перед пользователем список его действий. Ему поясняется логика взятия квестов на действия за веру в себя и предлагается выбрать одно из действий и взять не него квест. Пользователь...', [
    ['Выбирает одно из списка действий для взятия квеста', guidedGetQuest],
    ['Выходит в меню', continueAsGuidedUser],
  ])

  else if (again)  resolveByHand('Пользователю поясняется, что теперь от него ожидается, что он будет выполнять указанные действия во все дни квеста(-ов) и отчитываться об этом в программе, от чего будет повышаться его вера в себя, а по завершении квеста(-ов) будет возвращаттся залог. В противном случае залог будет сгорать, что впрочем не конец света, и всегда можно будет продолжить. Пэйсер поздравляет пользоавтеля с завершением обучалки-туториала и предлагает перейти к обычному интерфейсу. Пользователь...', [
    ['Покидает туториал, попадая в обычное главное меню', continueAsUser],
    ['Остаётся в туториале и просто выходит в меню', continueAsGuidedUser],
  ])

  else  resolveByHand('Пользователю поясняется, что для того, чтобы взять квест, необходимо, чтобы у него были среди прочих очень простые действия (со сложностью 1-2) - на них он сможет брать квесты даже тогда, когда у него совсем немного веры в себя. Пользователь...', [
    ['Переходит к добавлению действий', guidedAddActivity],
    ['Выходит в меню', continueAsGuidedUser],
  ])
}

function guidedGetQuest() {
  resolveByHand('Пользователю предлагается выбрать, должен ли квест начаться сегодня или завтра, сколько дней он продлится, показывается расчётная сумма залога и напоминается формула определения цены квеста (сложность * срок в днях). Пользователь...', [
    ['Выбирает дни и берёт квест', () => guidedTakeQuest('again')],
    ['Передумал и возвращаетя к списку действий для выбора другого',
      guidedTakeQuest],
  ])
}

function goToSettings() {
  resolveByHand('Пользователь видит список настроек с их текущими значениями. Он хочет...', [
    ['Использовать другой источних/хранилище данных',
      () => chooseDataSource('again')],
    ['Выйти из настроек и вернуться в главное меню', continueAsUser],
  ])
}

//? ============================================================================
async function fn1() {
  const choice = await resolveByHand(
    'message/question',
    [
      {label: 'label1', value: 'value1'},
      {label: 'label2', value: 'value2'},
      {label: 'label3', value: 'value3'},
    ]
  )

  if (choice == 'value1') fn1()
  else if (choice == 'value2') fn2()
  else fn3()
}

async function fn2() {
  const isTrue = await resolveByHand(
    'message/question',
    [
      {label: 'label1', value: true},
      {label: 'label2', value: false},
    ]
  )

  if (isTrue) fn1()
  else fn2()
}
