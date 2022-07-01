// Import external module
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Initialize app
const app = express();
// PORT initiate
const port = process.env.PORT || 5000;
// Enable cors
app.use(cors());

// Parse request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Connection URL
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u07m6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const tasksCollection = client.db("task-manager").collection("tasks");
    // Create task
    app.post("/create", async (req, res) => {
      const data = { ...req.body, createdAt: new Date() };
      const result = await tasksCollection.insertOne(data);
      res.send(result);
    });
    // Get all task
    app.get("/all", async (req, res) => {
      const tasks = await tasksCollection.find({}).toArray();
      res.send(tasks);
    });
    // Update task
    app.put("/all/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const tasks = await tasksCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: data }
      );
      res.send(tasks);
    });
    // Delete task
    app.delete("/all/:id", async (req, res) => {
      const id = req.params.id;
      const result = await tasksCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

// Initial route
app.get("/", async (req, res) => {
  res.send("Task manager server");
});

// Listen to app
app.listen(port, (err) => {
  if (!err) console.log(`Server successfully running at  PORT ${port}`);
});
