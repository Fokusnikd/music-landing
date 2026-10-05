export const school = {
  name: 'Ля минор',
  phone: '+7 (495) 440-04-40',
  phoneHref: 'tel:+74954400440',
  address: 'Москва, Камертонный переулок, 4',
  metro: '7 минут от м. «Белорусская»',
  hours: 'Пн–Пт 14:00–21:00, Сб–Вс 10:00–16:00',
}

export const navItems = [
  { href: '#ages', label: 'Возраст' },
  { href: '#instruments', label: 'Инструменты' },
  { href: '#teachers', label: 'Педагоги' },
  { href: '#prices', label: 'Цены' },
  { href: '#faq', label: 'Вопросы' },
  { href: '#contacts', label: 'Контакты' },
]

// Kids' color-note system: every note has its own color, like on boomwhackers
export const noteColors = ['#ff6b4a', '#ff9f43', '#ffc53d', '#5fd3a8', '#8fd3ff', '#4c6fff', '#9b7bff']
export const noteNames = ['до', 'ре', 'ми', 'фа', 'соль', 'ля', 'си']

export const AGE_MIN = 4
export const AGE_MAX = 17
// In 18 every student "moves to major": the joke behind the school's name
export const MAJOR_AGE = 18

export type Program = {
  id: string
  title: string
  ages: [number, number]
  format: string
  text: string
  points: string[]
  color: string
}

export const programs: Program[] = [
  {
    id: 'lalala',
    title: 'Ля-ля-ля',
    ages: [4, 6],
    format: 'Группа до 5 детей · 30 минут',
    text: 'Музыка через игру: ритмика, шумовой оркестр, песенки с движениями и первые клавиши. Никаких «сиди ровно».',
    points: ['Чувство ритма и слух', 'Знакомство со всеми инструментами', 'Мини-концерт для родителей раз в сезон'],
    color: '#ffc53d',
  },
  {
    id: 'octave-1',
    title: 'Первая октава',
    ages: [7, 10],
    format: 'Индивидуально · 45 минут',
    text: 'Выбираем инструмент и учим ноты так, чтобы сольфеджио казалось игрой, а не наказанием. Первый концерт через три месяца.',
    points: ['Инструмент + сольфеджио-игра', 'Пьесы, которые ребёнок выбирает сам', 'Выступление на отчётном концерте'],
    color: '#5fd3a8',
  },
  {
    id: 'octave-2',
    title: 'Вторая октава',
    ages: [11, 14],
    format: 'Индивидуально + ансамбль · 60 минут',
    text: 'Свой репертуар — от Баха до саундтреков из любимых игр. Играем в ансамбле, записываемся в школьной студии.',
    points: ['Ансамбль и сцена', 'Запись трека в студии', 'Подбор по слуху и импровизация'],
    color: '#8fd3ff',
  },
  {
    id: 'almost-major',
    title: 'Почти мажор',
    ages: [15, 17],
    format: 'Индивидуально · 60–90 минут',
    text: 'Последние годы в миноре. Готовим к поступлению в колледж или собираем свою группу — с репетициями, сведением и настоящими концертами.',
    points: ['Подготовка к поступлению', 'Своя группа и аранжировки', 'Сведение и выпуск трека'],
    color: '#ff6b4a',
  },
]

export const programForAge = (age: number) => programs.find((p) => age >= p.ages[0] && age <= p.ages[1]) ?? programs[0]

export type InstrumentId = 'piano' | 'guitar' | 'violin' | 'drums' | 'vocal' | 'ukulele'

export type Instrument = {
  id: InstrumentId
  title: string
  from: number
  text: string
  color: string
}

export const instruments: Instrument[] = [
  {
    id: 'piano',
    title: 'Фортепиано',
    from: 5,
    text: 'Классика жанра и лучший старт: видно все ноты сразу, а звук получается с первого нажатия.',
    color: '#ffc53d',
  },
  {
    id: 'guitar',
    title: 'Гитара',
    from: 8,
    text: 'Через месяц — первые аккорды и песня у костра. Детские гитары размера 1/2 и 3/4 есть в классе.',
    color: '#ff6b4a',
  },
  {
    id: 'violin',
    title: 'Скрипка',
    from: 5,
    text: 'Для терпеливых и мечтательных. Скрипки-«четвертушки» даём в прокат на первый год.',
    color: '#9b7bff',
  },
  {
    id: 'drums',
    title: 'Ударные',
    from: 6,
    text: 'Выпустить пар и научиться держать ритм. Соседям не слышно: класс со звукоизоляцией.',
    color: '#8fd3ff',
  },
  {
    id: 'vocal',
    title: 'Вокал',
    from: 5,
    text: 'Дыхание, интонация, сцена. Поём соло и в хоре, к концу года — запись в студии.',
    color: '#5fd3a8',
  },
  {
    id: 'ukulele',
    title: 'Укулеле',
    from: 6,
    text: 'Четыре струны, мягкие нейлоновые: пальцам не больно, а песни получаются уже на втором уроке.',
    color: '#ff9f43',
  },
]

export const findInstrument = (id: InstrumentId) => instruments.find((i) => i.id === id) ?? instruments[0]

// The first lesson as an A minor scale: each step sits on its own note of the staff
export const lessonSteps = [
  { note: 'ля', title: 'Привет!', text: 'Знакомимся и болтаем: что ребёнок слушает дома, что ему нравится, чего он боится.', time: '5 мин' },
  { note: 'си', title: 'Трогаем всё', text: 'Пробуем три-четыре инструмента прямо в классе. Шуметь можно и нужно.', time: '15 мин' },
  { note: 'до', title: 'Ищем своё', text: 'Педагог смотрит, где у ребёнка загораются глаза и что получается само.', time: '10 мин' },
  { note: 'ре', title: 'Первая мелодия', text: 'Разучиваем короткую мелодию — домой ребёнок уходит с тем, что уже умеет сыграть.', time: '10 мин' },
  { note: 'ми', title: 'Разговор с вами', text: 'Рассказываем, что заметили, предлагаем программу и расписание. Без обязательств.', time: '5 мин' },
]

export type TeacherLook = {
  skin: string
  hair: string
  style: 'bob' | 'short' | 'bun' | 'curly'
  bg: string
  sweater: string
  beard?: boolean
  glasses?: boolean
}

export const teachers: {
  name: string
  role: string
  experience: string
  fact: string
  instruments: InstrumentId[]
  look: TeacherLook
}[] = [
  {
    name: 'Анна Лебедева',
    role: 'Фортепиано, сольфеджио',
    experience: '14 лет с детьми',
    fact: 'Объясняет интервалы через мультики. Её ученики спорят, кто первым ответит.',
    instruments: ['piano'],
    look: { skin: '#f3c9a6', hair: '#6b3e26', style: 'bun', bg: '#ffe6a3', sweater: '#ffc53d', glasses: true },
  },
  {
    name: 'Тимур Галиев',
    role: 'Гитара, укулеле',
    experience: '9 лет с детьми',
    fact: 'Десять лет играл в группе, а потом понял, что учить интереснее. Знает все песни из «Смешариков».',
    instruments: ['guitar', 'ukulele'],
    look: { skin: '#d9a77f', hair: '#1f1a1a', style: 'short', bg: '#ffd2c5', sweater: '#ff6b4a', beard: true },
  },
  {
    name: 'Ольга Звонарёва',
    role: 'Скрипка, вокал',
    experience: '11 лет с детьми',
    fact: 'Лауреат конкурсов, но гордится другим: за 11 лет ни одного ученика, бросившего скрипку из-за скуки.',
    instruments: ['violin', 'vocal'],
    look: { skin: '#f6d5bd', hair: '#c9772c', style: 'bob', bg: '#e3dbff', sweater: '#9b7bff' },
  },
  {
    name: 'Дмитрий Бочкарёв',
    role: 'Ударные',
    experience: '7 лет с детьми',
    fact: 'Терпение — десять из десяти, проверено на восьмилетних барабанщиках. Учит держать ритм даже на кастрюлях.',
    instruments: ['drums'],
    look: { skin: '#e8b892', hair: '#3a2a20', style: 'curly', bg: '#d4f0ff', sweater: '#4c6fff', glasses: true },
  },
]

// Plans are named after note durations: the longer the note, the more music
export const plans = [
  {
    id: 'trial',
    title: 'Пробный',
    note: 'знакомство',
    price: 0,
    period: 'один раз',
    points: ['45 минут с педагогом', 'Пробуем 3–4 инструмента', 'Рекомендации и расписание'],
    featured: false,
  },
  {
    id: 'quarter',
    title: 'Четвертная',
    note: '4 урока в месяц',
    price: 6400,
    period: 'в месяц',
    points: ['Урок раз в неделю', 'Отчётные концерты', 'Перенос урока за 24 часа'],
    featured: false,
  },
  {
    id: 'eighth',
    title: 'Восьмая',
    note: '8 уроков в месяц',
    price: 11900,
    period: 'в месяц',
    points: ['Урок два раза в неделю', 'Сольфеджио-игра в подарок', 'Инструмент в прокат бесплатно'],
    featured: true,
  },
  {
    id: 'whole',
    title: 'Целая',
    note: 'всё и сразу',
    price: 15900,
    period: 'в месяц',
    points: ['8 индивидуальных уроков', 'Ансамбль или хор', 'Запись трека в студии раз в сезон'],
    featured: false,
  },
]

export const formatPrice = (value: number) => (value === 0 ? 'Бесплатно' : `${value.toLocaleString('ru-RU')} ₽`)

export const stats = [
  { value: 214, label: 'миноров учатся сейчас' },
  { value: 12, label: 'педагогов с консерваторией' },
  { value: 47, label: 'дипломов на конкурсах' },
  { value: 0, label: 'слёз над сольфеджио' },
]

export const reviews = [
  {
    author: 'Марина, мама Сони (8 лет)',
    text: 'Соня бросила две музыкалки. Здесь на пробном уроке выбрала укулеле, и теперь я слышу «Мама, ещё пять минут» — это про занятия, а не про мультики.',
  },
  {
    author: 'Игорь, папа Миши (12 лет)',
    text: 'Миша барабанит по всему, что видит, с трёх лет. Наконец-то это стало занятием, а не стихийным бедствием. Соседи передают спасибо.',
  },
  {
    author: 'Лиза, 15 лет',
    text: 'Пришла на вокал, а через год у нас своя группа и два трека. Дмитрий Олегович говорит, что барабанщика лучше не найти. Барабанщик — мой брат.',
  },
  {
    author: 'Ксения, мама Артёма (5 лет)',
    text: 'В «Ля-ля-ля» Артём перестал стесняться. На концерте сам вышел к микрофону и объявил номер. Я плакала, бабушка плакала, Артём — нет.',
  },
]

export const faq = [
  {
    q: 'Почему «Ля минор»?',
    a: 'Minor по-английски — «несовершеннолетний». Все наши ученики — миноры, от 4 до 17 лет. А ля — нота, по которой настраивается весь оркестр. В 18 лет ученики переходят в мажор: таков закон гармонии.',
  },
  {
    q: 'У ребёнка нет слуха. Возьмёте?',
    a: 'Возьмём. Слух — это навык, а не талант с рождения: он развивается так же, как мышцы. Через полгода занятий почти все дети чисто поют простые мелодии.',
  },
  {
    q: 'Нужно ли покупать инструмент?',
    a: 'Нет. Первые месяцы занимаемся на инструментах школы, а гитару, скрипку и укулеле даём в прокат домой. Покупать стоит, когда станет ясно, что это надолго — подскажем, какой.',
  },
  {
    q: 'Что, если ребёнку надоест?',
    a: 'Бывает. Можно сменить инструмент или педагога без доплаты, оставшиеся уроки абонемента переносятся. Мы не держим тех, кому скучно, — мы делаем так, чтобы скучно не было.',
  },
  {
    q: 'Можно ли родителям присутствовать на уроке?',
    a: 'На пробном — обязательно. Дальше по желанию ребёнка: многие лучше занимаются без зрителей, а для зрителей у нас есть отчётные концерты дважды в год.',
  },
  {
    q: 'С какого возраста можно начинать?',
    a: 'С 4 лет — в игровой группе «Ля-ля-ля». За конкретный инструмент обычно садятся с 5–7 лет, на гитару — с 8, когда рука дорастает до грифа.',
  },
]

// Simple pluralization for Russian numerals: 1 год, 2 года, 5 лет
export function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

export const years = (n: number) => `${n} ${plural(n, ['год', 'года', 'лет'])}`

export type Slot = { time: string; busy: boolean }
export type Day = { key: string; weekday: string; day: number; label: string; slots: Slot[] }

const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

// After school on weekdays, mornings on weekends; "busy" slots are pseudo-random but stable per date
export function bookingDays(count = 7): Day[] {
  const today = new Date()
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1)
    const weekend = date.getDay() === 0 || date.getDay() === 6
    const times = weekend ? ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] : ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
    const seed = date.getDate() * 7 + date.getMonth()
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return {
      key,
      weekday: weekdays[date.getDay()],
      day: date.getDate(),
      label: `${date.getDate()} ${months[date.getMonth()]}`,
      slots: times.map((time, j) => ({ time, busy: (seed + j * 3) % 5 === 0 })),
    }
  })
}
