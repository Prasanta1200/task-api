const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();

// Set up the EJS view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Tasks array
let tasks = [
  { id: '1', title: 'Test Task 1', is_completed: true },
  { id: '2', title: 'Test Task 2', is_completed: false }
];


// Route to get all tasks
app.get('/v1/tasks', (req, res) => {
  res.status(200).json({ tasks });
});

// Route to get a specific task by ID
app.get('/v1/tasks/:id', (req, res) => {
  const task = tasks.find(task => task.id === req.params.id);
  if (task) {
    res.status(200).json(task);
  } else {
    res.status(404).json({ error: 'There is no task at that id' });
  }
});

// Route to create a new task
app.post('/v1/tasks', (req, res) => {
  const { title } = req.body;
  const id = uuid.v4();
  const is_completed = false;
  tasks.push({ id, title, is_completed });
  res.status(201).json({ id });
});

// Route to edit a task
app.put('/v1/tasks/:id', (req, res) => {
  const task = tasks.find(task => task.id === req.params.id);
  if (task) {
    task.title = req.body.title || task.title;
    task.is_completed = req.body.is_completed || task.is_completed;
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'There is no task at that id' });
  }
});

// Route to delete a task
app.delete('/v1/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(task => task.id === req.params.id);
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
  }
  res.sendStatus(204);
});

// Route to bulk add tasks
app.post('/v1/tasks/bulk', (req, res) => {
  const { tasks: newTasks } = req.body;
  const createdTasks = [];
  newTasks.forEach(task => {
    const id = uuid.v4();
    const is_completed = task.is_completed || false;
    tasks.push({ id, ...task, is_completed });
    createdTasks.push({ id });
  });
  res.status(201).json({ tasks: createdTasks });
});

// Route to bulk delete tasks
app.delete('/v1/tasks/bulk', (req, res) => {
  const { tasks: deleteTasks } = req.body;
  deleteTasks.forEach(task => {
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        }
        });
        res.sendStatus(204);
        });
        
        // Start the server
        const port = 3000;
        app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        });
        
        module.exports = app;
