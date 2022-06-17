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

////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////READ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
    db.collection('transcript').find().sort({episode: 1}).toArray()
        .then(data => {
            // console.log(data)
            let episodes = data.map(item => item.episode)
            let titles = data.map(item => item.title)
            let epList = {
                episdoes:  titles
            }
            // console.log(nameList)
            res.render('index.ejs', {info: episodes, data:titles})
        })
        .catch(error => console.error(error))
})

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////returns details about chosen episdoe////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/api/:episodes', (req, res) => {
    let episodes = req.params.episodes
    db.collection('transcript').find().toArray()
        .then(data => {
            res.json(data.filter(objects => objects.episode === episodes)
            )
        })
        .catch(error => console.error(error))
})

////////////////////////////////////////////////////////////////////////////////////////////////
////////////returns every line from specified character in specified episode////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/api/:episodes/:char', (req, res) => {
    let episodes = req.params.episodes
    let char = req.params.char
    db.collection('transcript').find().toArray()
        .then(data => {
            let thisEpisode = data.filter(objects => objects.episode === episodes)
            let thisScript = thisEpisode[0].script
            let scriptArr = thisScript.split('\\n\\n')
            let lines = []
            for (let i =0; i < scriptArr.length; i++){
                let divide = scriptArr[i].split(': ')
                if (divide[1] && divide[0] === char){
                    lines.push(divide[1])
                }
            }
            res.json(lines)
            // res.render('index.ejs', {info: char, info: lines})
        })
        .catch(error => console.error(error))
})
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////search for phrase in whole database////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


// app.get('/search/:quotes', (req, res) => {
//     let quotes = req.params.quotes
//     db.collection('transcript').find().toArray()
//         .then(data => {
//             console.log(data.length)
//             // for( let i = 0; i <database.length; i++){
//             //     for(key in database[i]){
//             //         if(database[i][key].indexOf(quotes)!=-1) {
//             //             console.log(database[i])
//             //             results.push(database[i])
//             //         }
//             //     }
//             // }
//             // console.log(results)
//             res.json(data)
            
//         })
//         .catch(error => console.error(error))
// })





////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////CREATE//////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
app.post('/api', (req, res) => {
    let episode = req.body.episode
    let script = req.body.script
    db.collection('transcript').insertOne(
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
    db.collection('transcript').deleteOne(
        {episode: req.body.episode}
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