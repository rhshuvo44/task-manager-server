// Import external module
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

// Initialize app
const app = express();

// PORT initiate
const PORT = process.env.PORT || 5000;

// Enable cors
const corsConfig = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,HEADER",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsConfig));

// Parse request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connection URL
const url = process.env.DB_CONNECTION_URL;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// Database name
const dbName = process.env.DB_NAME;

async function run() {
  try {
    await client.connect();
    const tasksCollection = client.db(dbName).collection("tasks");

    // Create task
    app.post("/task/create", async (req, res) => {
      const data = { ...req.body, createdAt: new Date() };
      const result = await tasksCollection.insertOne(data);
      res.send(result);
    });

    // Get all task
    app.get("/task/all", async (req, res) => {
      const tasks = await tasksCollection.find({}).toArray();
      res.send(tasks);
    });

    // Update task
    app.put("/task/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const tasks = await tasksCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: data }
      );
      res.send(tasks);
    });

    // Delete task
    app.delete("/task/:id", async (req, res) => {
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
app.listen(PORT, (err) => {
  if (!err) console.log(`Server successfully running at  PORT ${PORT}`);
});
