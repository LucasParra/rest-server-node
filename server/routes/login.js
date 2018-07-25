const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

const app = express();
app.post('/login', (req, res) =>
{
	let body = req.body;
	Usuario.findOne({ email : body.email }, (err, usuarioBD) =>
	{
		if(err)
		{
		    return res.status(500).json({
		        ok : false,
		        err
		    });
		}
		if(!usuarioBD)
		{
			return res.status(400).json({
		        ok : false,
		        err : 
		        {
	        		message : "(Usuario) y/o contraseña incorrectos"
		        }
		    });
		}
		if(!bcrypt.compareSync(body.password, usuarioBD.password))
		{
		    return res.status(400).json({
		        ok : false,
		        err : 
		        {
	        		message : "Usuario y/o (contraseña) incorrectos"
		        }
		    });
		}
		let token = jwt.sign
		({
			usuario: usuarioBD,
		}, process.env.SEED, { expiresIn : process.env.CADUCIDAD_TOKEN});
		res.json({
	        ok : true,
	        usuario : usuarioBD,
	        token
	    });
	});
});


module.exports = app;