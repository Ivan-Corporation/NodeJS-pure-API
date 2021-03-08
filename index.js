const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')

mongoose.connect('mongodb+srv://ivan:217@cluster0.zafnn.mongodb.net/komadb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connect k baze');

})

const routes = require('./routes/routes')


app = express()

app.use(cookieParser())

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
}))

app.use(express.json())

app.use('/api', routes)

app.listen(8000)