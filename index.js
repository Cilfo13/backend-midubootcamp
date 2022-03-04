require('dotenv').config()
//Esto ejecuta lo que haya dentro
const Note = require('./models/Note')

const express = require('express')
const cors = require('cors')
const notFound = require('./middlewares/notFound.js')
const handleErrors = require('./middlewares/handleErrors.js')
const { default: mongoose } = require('mongoose')
const app = express()

app.use(cors())
app.use(express.json())
//Se debe poner la carpeta donde estaran los estaticos
app.use('/static',express.static('images'))


app.get("/debug-sentry", function mainHandler(req, res) {
	throw new Error("My first Sentry error!");
  });

app.get('/', (request, response)=>{
	response.send('<h1>Hello World</h1>')
})
app.get('/api/notes', (request, response, next)=>{
	Note.find({})
		.then((result) => {
			response.json(result)
		}).catch((err) => next(err));
})
app.get('/api/notes/:id', (request, response, next)=>{
	const {id} = request.params
	
	Note.findById(id).then(note=>{
		if(note){
			response.json(note)
		}else{
			response.status(404).end()
		}
	}).catch(err=>{
		next(err)
	})
})

app.delete('/api/notes/:id', (request, response, next)=>{
	const {id} = request.params
	Note.findByIdAndDelete(id)
		.then(()=>{response.status(204).end()})
		.catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next)=>{
	const {id} = request.params
	const note = request.body
	const newNoteInfo = {
		content: note.content,
		date: new Date(),
		important: note.important || false
	}
	//Esto solo actualiza la información que queremos y no lo elimina
	Note.findByIdAndUpdate(id, newNoteInfo, {new: true}).then(result=>{
		//el new: true es para que devuelva el valor actualizado y no el valor anterior
		response.json(result)
	}).catch(error => next(error))
})

app.post('/api/notes', (request, response, next)=>{
	const note = request.body

	if(!note || !note.content){
		return response.status(400).json({
			error: 'note.content is missing'
		})
	}

	const newNote = new Note({
		content: note.content,
		date: new Date(),
		important: note.important || false
	})

	newNote.save()
		.then(savedNote =>{
			response.status(201).json(savedNote)
		}).catch(err=>{
			next(err)
		})

})

app.use(notFound)

app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
	console.log(`Server running on port ${PORT}`)
})


