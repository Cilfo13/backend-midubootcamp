const express = require('express')
const res = require('express/lib/response')
const app = express()
app.use(express.json())

let notes = [
    {
        "id":1,
        "content":"Primera nota",
        "date": "2019-05-30T17:30:31.098Z",
        "important": true
    },
    {
        "id":2,
        "content":"Segunda nota",
        "date": "2019-03-30T17:30:31.098Z",
        "important": false
    },
    {
        "id":3,
        "content":"Tercera nota",
        "date": "2019-06-30T17:30:31.098Z",
        "important": true
    }
]
app.get('/', (request, response)=>{
    //Express pone el content-type correcto automaticamente
    response.send('<h1>Hello World</h1>')
})
app.get('/api/notes', (request, response)=>{
    response.json(notes)
})
app.get('/api/notes/:id', (request, response)=>{
    //Recupera el id pasado
    //!importante -> siempre los params devuelven un string
    //si queremos buscar un numero primero hay que pasarlo
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    //Si no encuentra la nota, devuelve un 404
    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/notes', (request, response)=>{
    const note = request.body

    if(!note || !note.content){
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }

    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)

    const newNote = {
        id: maxId+1,
        content: note.content,
        //Verificamos que no venga undefined el important
        important: typeof note.important !== undefined ? note.important : false,
        date: new Date().toISOString()
    }

    notes = [...notes, newNote]
    
    response.status(201).json(newNote)
})

const PORT = 3001

app.listen(PORT, ()=>{
    //Se mete aqui dentro para que se ejecute el codigo
    //una vez que se levanta el servidor
    console.log(`Server running on port ${PORT}`)
})

