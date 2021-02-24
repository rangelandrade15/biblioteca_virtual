const express = require('express');

var sqlite3 = require('sqlite3').verbose();



const app = express();
const bodyparse = require('body-parser');
var db = new sqlite3.Database('./database.db');
app.use(bodyparse.urlencoded({ extended: false }))
app.use(bodyparse.json())

db.run('CREATE TABLE IF NOT EXISTS usuario(email TEXT, nome TEXT, idade TEXT, endereco TEXT, telefone TEXT, senha TEXT)');
db.run('CREATE TABLE IF NOT EXISTS livros(id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, edicao TEXT, autor TEXT, editora TEXT)');
db.run('CREATE TABLE IF NOT EXISTS login(email TEXT, senha TEXT)');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');


livros = [

];
app.get("/", function(req, res) {
    res.render("login.html");
});
app.get("/cadastra", function(req, res) {
    res.render('cadastrar.html');
});

app.post("/cadastrar", function(req, res) {
    var titulo = req.body.titulo;
    var edicao = req.body.edicao;
    var autor = req.body.autor;
    var editora = req.body.editora;
    db.serialize(() => {
        db.run('INSERT INTO livros(titulo,edicao,autor,editora) VALUES(?,?,?,?)', [titulo, edicao, autor, editora], function(err, row) {
            if (err) {
                return console.log(err.message);
            }
            console.log("Livro cadastrado com sucesso!");

        });
    });



    res.redirect('/visualizar');
});

var aux = [];

app.get("/visualizar", function(req, res) {
    db.serialize(() => {
        db.each('SELECT * FROM livros WHERE id >=?', [1], function(err, row) {
            if (err) {
                console.log(err.message);
            }
            console.log(row);
            aux.push(row);
        });
    });

    res.render("visualizar.html", { livros: aux });
    aux = [];

});

app.post('/cadusuario', function(req, res) {
    var nome = req.body.nome;
    var endereco = req.body.endereco;
    var email = req.body.email;
    var idade = req.body.idade;
    var senha = req.body.senha;
    var telefone = req.body.telefone;
    db.serialize(() => {
        db.run('INSERT INTO usuario(email,nome, idade, endereco, telefone, senha) VALUES(?,?,?,?,?,?)', [email, nome, idade, endereco, telefone, senha], function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log("Usuario cadastrado com sucesso!");

        });
    });

    res.sendFile(__dirname + "/views/login.html");

});

app.post('/login', function(req, res) {

    var email = req.body.email;
    var senha = req.body.senha;
    db.serialize(() => {
        db.run('INSERT INTO login(email, senha) VALUES(?,?)', [email, senha], function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log("Está logado!");

        });
    });

    res.sendFile(__dirname + "/views/cadastrar.html");

});

app.post('/cadastrarusuario', function(req, res) {

    res.sendFile(__dirname + "/views/index.html");

});

app.post('/cadastro', function(req, res) {
    res.sendFile(__dirname + "/views/visualizar.html", { livros: livros });

});

app.get('/deletarlivros', function(req, res) {

    db.serialize(() => {
        db.run('DELETE FROM livros WHERE id = ?', [req.query.id], function(err) {
            if (err) {
                return console.log(err.message);
            }

            console.log("Está logado!");
        });
    });
    res.redirect("/visualizar");

});


app.listen(3000, function() {
    console.log("Servidor rodando!");
});