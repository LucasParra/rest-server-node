require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();


//Configuración parser
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());


//Configuración global rutas
app.use(require('./routes/index'));


//Conexión base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, resp)=>
{
    if(err) throw err;
    console.log("Base de datos online");
});


//Iniciar el server
app.listen(process.env.PORT,()=>
{
    console.log("Escucando puerto : ", process.env.PORT);
});