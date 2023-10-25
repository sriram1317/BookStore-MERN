import express, { request, response } from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose, { mongo } from "mongoose";
import { Book } from "./models/bookModels.js";



const app = express();

app.use(express.json());

// route for Home Page
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send(`Welcome to MERN STACK`);
});

// Route to Get all books from database
app.get('/books', async (request, response) =>{
    try{
        const books = await Book.find({});

        return response.status(200).json({
            count: books.length,
            data: books
        });
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
});


// Route to Get one book from database
app.get('/books/:id', async (request, response) =>{
    try{

        const { id } = request.params;

        const book = await Book.findById(id);

        return response.status(200).json(book);
    }
    catch(error){
        console.log(error.message);
        return response.status(500).send({message: error.message});
    }
});


// Route to insert/enter one book into database
app.post('/books', async (request, response) =>{
    try{
        if(!request.body.title || !request.body.author || !request.body.publishedYear){
            return response.status(400).send({
                message: `Send all required fields: Title, Author and Published year`
            });
        }

        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishedYear: request.body.publishedYear
        };

        const book = await Book.create(newBook);

        return response.status(201).send(book);

    }
    catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});


// Route to update a book
app.put('/books/:id', async (request, response) => {
    try{
        if(!request.body.title || !request.body.author || !request.body.publishedYear){
            return response.status(400).send({
                message: `Send all required fields: Title, Author and Published year`
            });
        }

        const { id } = request.params;
        
        const result = await Book.findByIdAndUpdate(id, request.body);

        if(!result){
            return response.status(404).json({message: `Book not found`});
        }
        else{
            return response.status(200).send({message: `Book Update succssfully`});
        }

    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});
 

// Route to delete a book
app.delete('/books/:id', async (request, response) => {
    try{
        const { id } = request.params;

        const result = await Book.findByIdAndDelete(id);

        if(!result){
            return response.status(404).json({message: `Book not found`});
        }
        else{
            return response.status(200).send({message: `Book deleted successfully`});
        }


    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});


// Connection to database
mongoose
    .connect(mongoURL)
    .then(() => {
        console.log(`App is connected to database`);
        app.listen(PORT, () =>{
            console.log(`App is listening on PORT: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });