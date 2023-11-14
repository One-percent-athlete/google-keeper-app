import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';

dotenv.config({ path: '.env' }); 
dotenv.config();

const database = process.env.database;
const password = process.env.password;

const app = express();
const port = 3000;

const db = new pg.Client({

  user: "postgres",
  host: "localhost",
  database: database,
  password: password,
  port: 5433,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC");

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: result.rows,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  await db.query(
    "INSERT INTO items (title) VALUES ($1)",
    [item]
  );
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
    const id = req.body.updatedItemId;
    const title = req.body.updatedItemTitle;

  await db.query("UPDATE items SET title = $1 WHERE id = $2", 
  [title, id]);

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const deleteId = req.body.deleteItemId

  await db.query("DELETE FROM items WHERE id= $1", 
  [deleteId]);

  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
