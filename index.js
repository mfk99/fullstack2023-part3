
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const morgan = require('morgan')


const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

morgan.token('content', function (req, res) {
  return JSON.stringify(req.body)
})




let persons = [
  {
  id: 1,
  name: "Arto Hellas",
  number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(
    `<div>Phonebook has info of ${persons.length} people</div>
    <div>${new Date().toString()}</div>`
    )
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    response.json(person)
  })
  res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const newPerson = req.body
  
  const name = newPerson.name
  const number = newPerson.number
  newPerson.id = Math.floor(Math.random()*1000)
  
  if (name === null || number === null) {
    return res.status(400).json({
      error: 'name and number must be inserted'
    })
  }

  const person = persons.find(person => person.name === name)
  
  if (person) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  persons = persons.concat(newPerson)
  res.status(201).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})