const express = require('express');
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const bodyParser = require('body-parser');
const app = express()

const uri = "mongodb+srv://carol_ribeiro1909:carol19@cluster0-z2vht.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('apinode') // coloque o nome do seu DB

    app.listen(3000, () => {
        console.log('Servidor da Funcionando na porta 3000')
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('cliente').find()
})

// metodo get 
app.get('/show', (req, res) => {
    db.collection('cliente').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })
    })
})

// fim do metodo get

// metodo post
app.post('/show', (req, res) => {
    db.collection('cliente').insertOne(req.body, (err, result) => {
        try {
            console.log('Salvo no Banco de Dados.')
            res.redirect('/show')
        } catch (err) {
            console.log(erro)
        }

    })
})

// fim metodo post



// metodo editar (put)

app.route('/editar/:id')
    .get((req, res) => {
        var id = req.params.id
        db.collection('cliente').find(ObjectId(id)).toArray((err, result) => {
            if (err) return res.send(err)
            res.render('edita.ejs', { data: result })
        })
    })

.post((req, res) => {
        var id = req.params.id
        var nome = req.body.nome
        var sobrenome = req.body.sobrenome

        db.collection('cliente').updateOne({ _id: ObjectId(id) }, {
            $set: {
                nome: nome,
                sobrenome: sobrenome
            }
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/show')
            console.log('Atualizado no Banco de Dados')
        })
    })
    // fim do método editar 

// metodo excluir
app.route('/deletar/:id').get((req, res) => {
    var id = req.params.id
    db.collection('cliente').deleteOne({ _id: ObjectId(id) }, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Item deletado com sucesso.')
        res.redirect('/show')
    })
})


// fim metodo excluir