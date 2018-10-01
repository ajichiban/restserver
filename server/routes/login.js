/*--- Model ---*/
const Usuario = require('../models/usuario')

/*--- Packages ---*/
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const express = require('express')


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
		},process.env.SEED ,{expiresIn: process.env.CADUCIDAD_TOKEN }
		)

		res.json({
			ok:true,
			user : userDb,
			token
		})

	})
	
})


module.exports = app