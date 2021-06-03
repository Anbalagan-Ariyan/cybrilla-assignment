const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes')
const app = express();

app.use(cors());


app.use((req,res,next) => {
    bodyParser.json({
        limit:'50mb',
        verify: (req,res,buf,encoding) => {
            req.rawBody = buf.toString();
        }
    })(req,res,err => {
        if(err) {
            res.status(400).send('bad body request');
            return
        }
        next();
    })
})

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended:true
}));

mongoose
    .connect("mongodb+srv://cybrilla:Password@123@cluster0.m3fib.mongodb.net/test", {
    useNewUrlParser: true , useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true, })
    .then(() => console.log("mongodb connected"))
    .catch(err => console.log(err));     

const port = process.env.PORT || 8000

app.use('/api', routes)

app.listen(port,  () => {
    console.log(`listening on *:${port}`);
})