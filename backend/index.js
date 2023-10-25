import express, { request, response } from "express";
import { PORT, mongoURL } from "./config.js";
import mongoose, { mongo } from "mongoose";
import { Book } from "./models/bookModels.js";
import booksRoute from "./routes/booksRoute.js";
import cors from "cors";

const app = express();

app.use(express.json());


// Middleware handling
// option 1, allowing all origin, methods etc
// app.use(cors());
// option 2, mentioning the origin methods and allowedHeaders
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type'],
}));

// route for Home Page
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send(`Welcome to MERN STACK`);
});


app.use('/books', booksRoute);


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