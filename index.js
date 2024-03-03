import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "admin@123",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

let tasks = [];
let test = [];

//Fetch data from table
app.get("/", async(req, res) => {
  
  try {
    const result = await db.query("SELECT * from items");
    items = result.rows;
    console.log(items);
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items
     }); 
  } catch (error) {
    console.log(error.message);
  }
});

//Add new entry
app.post("/add", async(req, res) => {
  
  try {
    const item = req.body.newItem;
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
});

//Edit a entry
app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err.message);
  }
});

//Delete a entry from table
app.post("/delete", async(req, res) => {
  try {
    const deleteItem = req.body.deleteItemId;
    await db.query("DELETE FROM items WHERE id = $1", [deleteItem])
    res.redirect("/");
  } catch (error) {
      console.log(error.message);
  }
});

app.listen(port, () => {
  console.log("Server running on port " +port);
});
