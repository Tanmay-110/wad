const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Insert 5 songs initially
router.get('/insertSample', async (req, res) => {
    const songs = [
        { songname: 'Tum Hi Ho', film: 'Aashiqui 2', music_director: 'Mithoon', singer: 'Arijit Singh' },
        { songname: 'Kal Ho Naa Ho', film: 'Kal Ho Naa Ho', music_director: 'Shankar-Ehsaan-Loy', singer: 'Sonu Nigam' },
        { songname: 'Channa Mereya', film: 'Ae Dil Hai Mushkil', music_director: 'Pritam', singer: 'Arijit Singh' },
        { songname: 'Tujh Mein Rab Dikhta Hai', film: 'Rab Ne Bana Di Jodi', music_director: 'Salim–Sulaiman', singer: 'Roop Kumar Rathod' },
        { songname: 'Kun Faya Kun', film: 'Rockstar', music_director: 'A. R. Rahman', singer: 'Mohit Chauhan' }
    ];
    await Song.insertMany(songs);
    res.redirect('/');
});

// Display all songs and count
router.get('/', async (req, res) => {
    const songs = await Song.find({});
    const count = await Song.countDocuments();
    res.render('songs', { songs, count });
});

// Filter by Music Director
router.post('/filterByDirector', async (req, res) => {
    const { music_director } = req.body;
    const songs = await Song.find({ music_director });
    const count = songs.length;
    res.render('songs', { songs, count });
});

// Filter by Music Director and Singer
router.post('/filterByDirectorSinger', async (req, res) => {
    const { music_director, singer } = req.body;
    const songs = await Song.find({ music_director, singer });
    const count = songs.length;
    res.render('songs', { songs, count });
});

// Filter by Film and Singer
router.post('/filterByFilmSinger', async (req, res) => {
    const { film, singer } = req.body;
    const songs = await Song.find({ film, singer });
    const count = songs.length;
    res.render('songs', { songs, count });
});

// Delete a song by name
router.post('/deleteSong', async (req, res) => {
    const { songname } = req.body;
    await Song.findOneAndDelete({ songname });
    res.redirect('/');
});

// Add a new song
router.post('/addSong', async (req, res) => {
    const { songname, film, music_director, singer } = req.body;
    await Song.create({ songname, film, music_director, singer });
    res.redirect('/');
});

// Update song with actor & actress
router.post('/updateSong', async (req, res) => {
    const { songname, actor, actress } = req.body;
    await Song.findOneAndUpdate({ songname }, { actor, actress });
    res.redirect('/');
});

module.exports = router;
