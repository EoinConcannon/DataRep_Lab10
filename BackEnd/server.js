//npm install express
//right click on server.js and select integrated terminal
//run the command node server.js
//USE THE COMMAND PROMPT AND VSC TERMINAL BELOW

const express = require('express')
const app = express()
const port = 4000

// Serve the static files from the React app
const path = require('path');
app.use(express.static(path.join(__dirname, '../build')));
app.use('/static', express.static(path.join(__dirname, 'build//static')));

// const cors = require('cors'); //can now comment out this cors/app.use because of app.get(*) below
// app.use(cors());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
//single page apps need to rebuild app after changes are made

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// https://mongoosejs.com/docs/index.html
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://admin:admin@cluster0.rmuylit.mongodb.net/?retryWrites=true&w=majority');//access the database from mongodb (replace <password> with the actual password)

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const bookSchema = new mongoose.Schema({
    title: String,
    cover: String,
    author: String
})

const bookModel = mongoose.model('books', bookSchema);//new array of json data

app.delete('/api/book/:id', async (req, res) => { //can give this any url you want (url is '/api/book/:id' to be professional / following this, url in bookItems.js must be exact match)
    console.log("Delete: " + req.params.id);

    let book = await bookModel.findByIdAndDelete(req.params.id) //waits for response, doesn't freeze app
    res.send(book); // need to send a response or browser will send an error
})

app.put('/api/book/:id', async (req, res) => {
    console.log("Update: " + req.params.id);

    let book = await bookModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(book);
})

app.post('/api/books', (req, res) => {//on create.js page when "add book" is clicked, check the integrated terminal below, the new book is recorded
    console.log(req.body);
    bookModel.create({
        title: req.body.title,
        cover: req.body.cover,
        author: req.body.author
    })
        .then(() => { res.send("Book Created"); })
        .catch(() => { res.send("Book Not Created"); })
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/books', async (req, res) => {//too long, async = wait for response

    let books = await bookModel.find({});
    res.json(books);

});

app.get('/api/book/:id', async (req, res) => {
    console.log(req.params.id);

    let book = await bookModel.findById({ _id: req.params.id })
    res.send(book);
})
//http://localhost:4000/api/book/655737cc2cda8f8c0738efa2  type this to url to see the book you added via id

// Handles any requests that don't match the ones above
app.get('*', (req, res) => { //sends the webpage back (* = any urlthat doresn't exist sends you back to homepage)
    res.sendFile(path.join(__dirname + '/../build/index.html'));
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


//mongodb+srv://admin:<password>@cluster0.rmuylit.mongodb.net/?retryWrites=true&w=majority