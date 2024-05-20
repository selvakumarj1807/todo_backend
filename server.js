//Expreess
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

//create an instance of express
const app = express();
app.use(express.json());
app.use(cors());

//sample in-memory storage for todo items
//let todos = []

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/totoapp')
    .then(() => {
        console.log('DB Connected!')
    })
    .catch(() => {
        console.log(err)
    })

//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating model
const todoModel = mongoose.model('Todo', todoSchema);

//create a new todo item
app.post('/todos', async (req, res) => {
    const { title, description } = req.body;

    try {
        const newTodo = new todoModel({ title, description })
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})

//delete a todo list
app.delete('/todos/:id', async (req, res) => {
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})

//get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})

//update a todo item
app.put('/todos/:id', async (req, res) => {
    try {
        const { title, description } = req.body;
        const id = req.params.id;
        const updateTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )
        if (!updateTodo) {
            return res.status(404).json({ message: "Todo id not found" })
        }
        res.json(updateTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
})

//start the server
const port = 8000;
app.listen(port, () => {
    console.log("Server is running" + port);
})