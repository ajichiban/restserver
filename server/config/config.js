/*===========================================================
                         PUERTO                                  
=============================================================*/
process.env.PORT = process.env.PORT || 3000

/*=============================================
				ENTORNO
=============================================*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


/*=============================================
				JWT VENCIMIENTO
=============================================*/
process.env.CADUCIDAD_TOKEN = "30 days"

/*=============================================
				SEED DE AUTENTIFICACION
=============================================*/

process.env.SEED = 'este-es-el-seed-de-desarrollo'

/*=============================================
				BASES DE DATOS
=============================================*/

let urlDB
if (process.env.NODE_ENV === 'dev'){
	urlDB = 'mongodb://localhost:27017/cafe'
}else{
	urlDB = 'mongodb://cafe-user:102455aj@ds115283.mlab.com:15283/cafe'
}

process.env.URLDB = urlDB

/*=============================================
				GOOGLE CLIEN ID
=============================================*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '16313238604-aueuvt4q7bhnhn9s8rj7o34bb58b5ln3.apps.googleusercontent.com'