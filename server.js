//REQUIRE DEPENDENCIES
const { render } = require('ejs')
const { response } = require('express')
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8005
require('dotenv').config()

//DECLARED DB VARIABLES
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'friends-tv-api'

//CONNECT TO MONGODB
MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log('Database Connected to ' + dbName)
        db = client.db(dbName)
    })

//SET MIDDLEWARE
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//CRUD
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////READ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    db.collection('quotes').find().toArray()
        .then(data => {
            // console.log(data)
            let nameList = data.map(item => item.character)
            console.log(nameList)
            res.render('index.ejs', {info: nameList})
        })
        .catch(error => console.error(error))
})



////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////CREATE//////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/api', (req, res) => {
    db.collection('quotes').insertOne(
        req.body
    )
    .then(result => {
        console.log(result)
        res.redirect('/')
    })
})



////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////UPDATE///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
app.put('/updateEntry', (req, res) => {
    Object.keys(req.body).forEach(key => {
        if (req.body[key] === null || req.body[key] === undefined || req.body[key] === ''){
            delete req.body[key]
        }
    })
    console.log(req.body)
    db.collection('quotes').findOneAndUpdate(
        {name: req.body.name},
        {
            $set: req.body
        }
    )
    .then(res => {
        // console.log(result)
        res.json('Success')
    })
    .catch(error => console.error(error))

})



////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////DELETE///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
app.delete('/deleteEntry', (req, res) => {
    db.collection('quotes').deleteOne(
        {name: req.body.name}
    )
    .then(result => {
        console.log('Entry Deleted')
        res.json('Entry Deleted')
    })
    .catch(error => console.error(error))
})






//SET UP LOCAL HOST
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})