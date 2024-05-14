const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI || '', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
    }).catch(err=>{
        console.error('\x1b[41m%s\x1b[37m',`db error ${err.message}`, '\x1b[0m');
})