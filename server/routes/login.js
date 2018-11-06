/*--- Model ---*/
const Usuario = require('../models/usuario')

/*--- Packages ---*/
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const express = require('express')

/*--- Google Config ---*/
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const app = express()

app.post('/login', (req, res)=> {

	let body = req.body 

	Usuario.findOne({email : body.email}, (err, userDb)=>{

		if (err){
			return res.status(500).json({
				ok:false,
				err
			})
		}
		console.log(userDb)
		
		if( !userDb){
			return res.status(400).json({
				ok:false,
				err:{
					message: '(usuario) o contraseña incorrectas'
				}
			})
		}

		if(!bcrypt.compareSync(body.password, userDb.password)){
			return res.status(400).json({
				ok:false,
				err:{
					message: 'usuario o (contraseña) incorrectas'
				}
			})
		}

		let token = jwt.sign({
			usuario : userDb
		},process.env.SEED ,{expiresIn: process.env.CADUCIDAD_TOKEN })

		res.json({
			ok:true,
			user : userDb,
			token
		})

	})
	
})

// Config - Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();

  // retorna los datos de user
  return {
	  nombre: payload.name,
	  email: payload.email,
	  img: payload.picture,
	  google: true
  }
  
}

// Login con Google
app.post('/google', async(req, res)=>{
	// 1 # recibo el idtoken 
	let token  = req.body.idtoken

	// 2 # verifico el token con la libreria de google
	let googleUser = await verify(token)
		.catch(e => {
			return res.status(403).json({
				ok: false,
				err: e
			})
		})

	// 3 # Validar  el  user en la bd

	Usuario.findOne({ email: googleUser.email }, (err, userDb)=>{
		if(err){
			return res.status(500).json({
				ok:false,
				err
			})
		}
		// Si existe el user en la db
		if(userDb){

			// si tiene auth = false
			if(userDb.google === false ){
				return res.status(400).json({
					ok:false,
					err:{
						msg: "debes autentificarte  de manera normal (correo y pass)"
					}
				})
			}else{
				let token = jwt.sign({
					usuario : userDb
				},process.env.SEED ,{expiresIn: process.env.CADUCIDAD_TOKEN })

				return res.json({
					ok:true,
					usuario: userDb,
					token
				})
			}
		// Si no existe en la bd
		}else{
			let user = new Usuario()
			user.nombre = googleUser.nombre
			user.email = googleUser.email
			user.img = googleUser.img
			user.google = googleUser.google
			user.password = ":)"

			user.save( (err, userDb)=>{

				if(err){
					return res.status(500).json({
						ok:false,
						err
					})
				}

				let token = jwt.sign({
					usuario : userDb
				},process.env.SEED ,{expiresIn: process.env.CADUCIDAD_TOKEN })

				return res.json({
					ok:true,
					usuario: userDb,
					token
				})

			})
		}
	})
	
	


})


module.exports = app