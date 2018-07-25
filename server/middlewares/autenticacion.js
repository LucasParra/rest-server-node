const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => 
{
	let token = req.get('token');
	jwt.verify(token, process.env.SEED, (err, decoded)=>
	{
		if(err)
		{
		    return res.status(401).json({
		        ok : false,
		        err : 
		        {
		        	message : "Token no válido",
		        	err
		        }
		    });
		}
		req.usuario = decoded.usuario;
		next();
	});
};
let verificaAdmin_Role = (req,res,next) =>
{
	let usuario = req.usuario;
	if(usuario.role !== "ADMIN_ROLE")
	{
	    return res.status(401).json({
	        ok : false,
	        err : 
	        {
	        	message : "El usuario no es administrador"
	        }
	    });
	}
	next();
}
module.exports = 
{
	verificaToken,
	verificaAdmin_Role
}