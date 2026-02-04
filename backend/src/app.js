const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const path = require('path');


const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')))
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('*name',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/index.html'))
})

module.exports = app;


// comment out these when you run your site on localhost
// const path = require('path');
// app.use(express.static(path.join(__dirname,'../public')))
// app.get('*name',(req,res)=>{
//     res.sendFile(path.join(__dirname,'../public/index.html'))
// })
// aur frontend me sare link ko localhost krdo