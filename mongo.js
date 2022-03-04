const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

//Conexión a mongodb
mongoose.connect(connectionString)
    //Devuelve una promesa
    .then(()=>{
        console.log('[db] connected!')
    }).catch(err=>{
        console.error(err)
    })

    
process.on('uncaughtException', ()=>{
	mongoose.connection.disconnect()
})