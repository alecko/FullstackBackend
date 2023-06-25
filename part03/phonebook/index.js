require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')



const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('postData', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : 'no body data' })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

app.get('/info', (request, response) => {
    Person.find({}).then(p => {
        response.json({ message: `There are ${p.length} entries in the phonebook` })
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(p => {
        response.json(p)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(p => response.json(p))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id).then(p => {
        response.status(204).end()
    }).catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'the id is malformed' })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})