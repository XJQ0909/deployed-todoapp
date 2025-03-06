const PORT =  process.env.PORT ?? 8000
require("dotenv").config({ path: './.env' })
const {MongoClient} = require("mongodb")
const express = require('express')
const {v4:uuidv4} = require('uuid')
const cors = require('cors')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// const Todo = require('../models/todo')   
// const User = require('../models/user')   // User model

const app = express()

app.use(cors(
    {
        origin:["http://localhost:3000"],
        methods:["POST", "GET","PUT","DELETE","OPTIONS"],
      
        credentials: true
    }
))
app.use(express.json())

const Db =  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.2heqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const client = new MongoClient(Db)

client.connect()
.then(() => {
  console.log('Connected to MongoDB')
  db = client.db('todoapp')  // the name of the database
  usersCollection = db.collection('users')  // users collection
  todosCollection = db.collection('todos')
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err)
})


app.get('/todos/:userName',async(req,res) =>{
    const {userName} = req.params
    try {
        const todos = await todosCollection.find({ user_name: userName }).toArray()
        res.json(todos)
    } catch (error) {
        console.error(error)
    }
})

//create a new todo
app.post('/todos', async(req,res)=>{
    const {user_name,title,completed,date}=req.body
    const id = uuidv4()
    const newToDo = {
        id,
        user_name,
        title,
        completed,
        date,
    }

    try {
       const result = await todosCollection.insertOne(newToDo)
       res.json(newToDo)
    } catch (error) {
        console.error(error)
    }
})

//edit a todo
app.put('/todos/:id',async(req,res)=>{
    const{id} = req.params
    const {user_name, title, completed, date} = req.body
    try {
        const updateResult = await todosCollection.updateOne(
            { id: id },  //search id
            {
                $set: {  
                    title
                }
            }
        )

        const updatedToDo = await todosCollection.findOne({ id: id })
        res.json(updatedToDo)
    } catch (error) {
        console.error(error)
    }
})

//check (ie Cross off) a todo
app.put('/todos/:id/status', async (req, res) => {
    const { id } = req.params
    const { completed } = req.body // The completed status from the client
    
    try {
    
    const updateResult = await todosCollection.updateOne(
        { id: id },  // search id
        { $set: { completed } }  
    )

    const updatedTask = await todosCollection.findOne({ id: id })
    res.json(updatedTask)
    } catch (error) {
      console.error(error)
    }
  })


//delete a todo
app.delete('/todos/:id',async(req,res)=>{
    const {id} = req.params
    
    try {
        const deleteToDo = await todosCollection.deleteOne({ id: id })
        res.json(deleteToDo) 
    } catch (error) {
        console.error(error)
    }
})

//sign up
app.post('/signup', async(req, res)=>{
    const {username, password} = req.body 
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password,salt)

    try {
    const existingUser = await usersCollection.findOne({ username })
    if (existingUser) {
        return res.json({ detail: 'Username already exists!' })
    }

    // insert new user into MongoDB
    const newUser = { username, hashed_password: hashedPassword }
    await usersCollection.insertOne(newUser)

    const token = jwt.sign({ username }, 'secret', { expiresIn: '1hr' })

    res.json({ username, token })

    } catch (error) {
        console.error(error)
        if(error){
            res.json({detail: error.detail})
        }
    }
})

//login
app.post('/login', async(req, res)=>{
    const{username,password}=req.body
    try {

        const user = await usersCollection.findOne({ username })

        if (!user) {
            return res.json({ detail: 'User does not exist!' })
        }

        const compareResult = await bcrypt.compare(password, user.hashed_password)

        if (compareResult) {
            const token = jwt.sign({ username }, 'secret', { expiresIn: '1hr' })
            res.json({ username: user.username, token })
        } else {
            res.json({ detail: 'Login failed' })
        }

    } catch (error) {
        console.error(error)
    }
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))