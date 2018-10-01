/*=============================================
				VERIFICAR TOKEN
=============================================*/

const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {

	let token  = req.get('token')

	jwt.verify(token, process.env.SEED, (err, decoded)=> {

		if (err){
			return res.status(401).json({
				ok:false,
				err
			})
		}

		req.usuario = decoded.usuario

		next()
	})

}

/*=============================================
				VERIFICAR  ADMIN_ROLE
=============================================*/

let verificaAdminRole = (req, res, next) =>{
	let user = req.usuario

	if( user.role === 'ADMIN_ROLE'){
		next()
	}else{
		return res.status(403).json({
			ok:false,
			err:{
				role: user.role,
				nombre: user.nombre ,
				message: "No tienes autorizacion para  ejecutar esta accion, debes ser ADMIN "
			}
		})
	}
}

module.exports = {
	verificaToken,
	verificaAdminRole
}