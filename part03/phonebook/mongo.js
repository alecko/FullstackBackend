const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = 
    `mongodb+srv://alemaldo:${password}@cluster0.7c7u00d.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === Number(3)) {
    Person.find({}).then((result) => {
        console.log('phonebook')
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
        process.exit(1)
    })

} else {
    if (process.argv.length < 5) {
        console.log('No name or number was given')
        process.exit(1)
    }
    if (process.argv[3].trim().length < 1 || process.argv[4].trim().length < 1) {
        console.log('No name or number was given')
        process.exit(1)
    }

    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    newPerson.save().then(result => {
        console.log(`${process.argv[3]} was added to the phonebook, number ${process.argv[4]}`)
    }).then(() => { mongoose.connection.close() })

}



