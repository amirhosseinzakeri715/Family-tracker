import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD, 
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

// Get users from database instead of hardcoding
async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

async function checkVisisted() {
  const result = await db.query(
    "SELECT country_code FROM visited_countries JOIN users ON users.id = user_id WHERE user_id = $1;",
    [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getCurrentUser() {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [currentUserId]);
  return result.rows[0];
}

app.get("/", async (req, res) => {
  try {
    const countries = await checkVisisted();
    const currentUser = await getCurrentUser();
    const users = await getUsers();
    
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      users: users,
      color: currentUser.color,
    });
  } catch (err) {
    console.error("Error in GET /:", err);
    res.status(500).send("Server error");
  }
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    if (!result.rows[0]) {
      return res.status(400).send("Country not found");
    }

    const countryCode = result.rows[0].country_code;
    
    await db.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
      [countryCode, currentUserId]
    );
    
    res.redirect("/");
  } catch (err) {
    console.error("Error in POST /add:", err);
    res.status(500).send("Server error");
  }
});

app.post("/user", async (req, res) => {
  try {
    if (req.body.add === "new") {
      res.render("new.ejs");
    } else {
      currentUserId = parseInt(req.body.user);
      res.redirect("/");
    }
  } catch (err) {
    console.error("Error in POST /user:", err);
    res.status(500).send("Server error");
  }
});

app.post("/new", async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).send("Name and color are required");
    }

    const result = await db.query(
      "INSERT INTO users (name, color) VALUES($1, $2) RETURNING *;",
      [name, color]
    );

    currentUserId = result.rows[0].id;
    res.redirect("/");
  } catch (err) {
    console.error("Error in POST /new:", err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
