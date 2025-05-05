const express = require("express");
const mongoose = require("mongoose");
const Song = require("./models/Song");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/music", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// a) Insert 5 documents if not already inserted
const insertInitialSongs = async () => {
  const count = await Song.countDocuments();
  if (count === 0) {
    await Song.insertMany([
      {
        songname: "Tum Hi Ho",
        film: "Aashiqui 2",
        music_director: "Mithoon",
        singer: "Arijit Singh",
      },
      {
        songname: "Chaiyya Chaiyya",
        film: "Dil Se",
        music_director: "A.R. Rahman",
        singer: "Sukhwinder Singh",
      },
      {
        songname: "Kal Ho Naa Ho",
        film: "Kal Ho Naa Ho",
        music_director: "Shankar-Ehsaan-Loy",
        singer: "Sonu Nigam",
      },
      {
        songname: "Z coming",
        film: "Alpha",
        music_director: "Mithoon",
        singer: "Arijit Singh",
      },
      {
        songname: "Kun Faya Kun",
        film: "Rockstar",
        music_director: "A.R. Rahman",
        singer: "Javed Ali",
      },
    ]);
  }
};

insertInitialSongs();

// d) Display all documents and count
app.get("/", async (req, res) => {
  const songs = await Song.find();
  const count = await Song.countDocuments();
  res.render("songs", { songs, count });
});

// e) List specified Music Director songs
app.get("/director/:name", async (req, res) => {
  const songs = await Song.find({ music_director: req.params.name });
  res.render("songs", { songs, count: songs.length });
});

// f) List songs by Music Director and Singer
app.get("/director/:name/singer/:singer", async (req, res) => {
  const songs = await Song.find({
    music_director: req.params.name,
    singer: req.params.singer,
  });
  res.render("songs", { songs, count: songs.length });
});

// g) Delete song by name
app.get("/delete/:name", async (req, res) => {
  await Song.deleteOne({ songname: req.params.name });
  res.redirect("/");
});

// h) Add favorite song
app.post("/add", async (req, res) => {
  const { songname, film, music_director, singer } = req.body;
  await Song.create({ songname, film, music_director, singer });
  res.redirect("/");
});

// i) Songs by singer and film
app.get("/film/:film/singer/:singer", async (req, res) => {
  const songs = await Song.find({
    film: req.params.film,
    singer: req.params.singer,
  });
  res.render("songs", { songs, count: songs.length });
});

// j) Update song with Actor & Actress
app.get("/update/:name", async (req, res) => {
  const song = await Song.findOne({ songname: req.params.name });
  res.render("update", { song });
});

// Handle update form submission
app.post("/update/:name", async (req, res) => {
  const { actor, actress } = req.body;
  await Song.updateOne(
    { songname: req.params.name },
    { $set: { actor, actress } }
  );
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
