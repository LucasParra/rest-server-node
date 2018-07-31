const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');

//Google OAuth
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

let verify = async (token) =>
{
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID
	});
	let payload = ticket.getPayload(); 
	return {
		nombre : payload.name,
		email : payload.email,
		google : true,
		img  : payload.picture
	};
}
app.post('/google', async (req, res) =>
{
	let token = req.body.idtoken;
	let googleUser = await verify(token).catch((err)=> 
	{
		return res.status(403).json({
			ok : false,
			err
		})
	});
	Usuario.findOne({email : googleUser.email},(err,usuarioBD)=>
	{
		if(err)
		{
		    return res.status(500).json({
		        ok : false,
		        err
		    });
		}
		if(usuarioBD)
		{
			if(usuarioBD.google === false)
			{
			    return res.status(400).json({
			        ok : false,
			        err : 
			        {
			        	message : "Debe de usar su atenticación normal"
			        }
			    });
			}
			else
			{
				let token = jwt.sign
				({
					usuario: usuarioBD,
				}, process.env.SEED, { expiresIn : process.env.CADUCIDAD_TOKEN});

				return res.json({
					ok : true,
					usuario : usuarioBD,
					token
				});
			}
		}
		else
		{
			//Si el usuario no existe en la base de datos
			let usuario = new Usuario();
			usuario.nombre = googleUser.nombre;
			usuario.email = googleUser.email;
			usuario.img = googleUser.img;
			usuario.google = true;
			usuario.password = ':)';
			usuario.save((err,usuarioDB) => 
			{

				if(err)
				{
				    return res.status(500).json({
				        ok : false,
				        err
				    });
				}
				let token = jwt.sign
				({
					usuario: usuarioDB,
				}, process.env.SEED, { expiresIn : process.env.CADUCIDAD_TOKEN});

				return res.json({
					ok : true,
				});
			});
		}
	});
});

module.exports = app;