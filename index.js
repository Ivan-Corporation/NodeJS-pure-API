const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://ivan:217@cluster0.zafnn.mongodb.net/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('connect k baze');

})

const routes = require('./routes/routes')


app = express()
app.use(express.json())

app.use('/api', routes)

app.listen(8000)