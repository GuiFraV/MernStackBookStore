import express from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Book } from './models/bookModels.js';

const app = express();

app.use(express.json())

app.use((req, res, next) => {
    console.log('Body:', req.body);
    next();
});


app.get('/', (req, res) => {
    console.log(req)
    return res.status(234).send('Hello World')
});

app.post('/books', async(req, res) => {
    console.log(Book)
    try {
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ){  
            console.log((req))
            return res.status(400).send({
                message: "Send all required fields: title, author, publishYear",
            })
        }
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
        }
        const book = await Book.create(newBook);
        return res.status(201).send(book)
    }catch(error){
        console.log(error.message)
        res.status(500).send({ message: error.message })
    }
})

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database')
        app.listen(PORT, () => {
            console.log(`App running to port ${PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    });