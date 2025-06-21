const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler')

const app = express();
dotenv.config();

const userService = require('./services/userService')
const StreamClient = require('./utils/streamClient')

// DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
})
    .then(() => {
        console.log('MongoDB connected')
        userService.getAllUsers().then(async users => {
            const streamClient = new StreamClient()
            await streamClient.syncUsers(users)
        })
    })
    .catch(console.log);

// Public folder setup
app.use(express.static('public')); //No need of public folder for html
// Bodyparser
//parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
//parse JSON bodies (as sent by API clients)
app.use(express.json());

// for cross origin request
app.use(cors())

//Routes
app.use('/admin', require('./routes/adminRoutes'))
app.use('/', require('./routes/index'))

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port ${PORT}`))