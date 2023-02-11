
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')
const morgan = require('morgan')
const { response } = require('express')


const app = express()
app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('content', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(
    `<div>Phonebook has info of ${persons.length} people</div>
    <div>${new Date().toString()}</div>`
    )
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })
  person.save()
  res.status(201).end()
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)