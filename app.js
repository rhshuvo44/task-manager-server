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
    const taskCollection = client.db("task-manager").collection("tasks");
  } finally {
  }
}
run().catch(console.dir);

// Initial route
app.get("/", (req, res) => {
  res.send("Auto Parts server");
});
// Listen to app
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
