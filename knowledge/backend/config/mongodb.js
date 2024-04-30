const { mongoUri } = require('../.env')
const mongoose = require('mongoose')

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    }).catch(err=>{
        console.error('\x1b[41m%s\x1b[37m',`db error ${err.message}`, '\x1b[0m');
})