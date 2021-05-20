const axios = require('axios');
const express = require('express');
const router = express.Router();
const db = require('../models');
const fetch = require('node-fetch');
const fs = require('fs');

router.get('/', function(req, res) {
    db.pokemon.findAll()
    .then((results) => {
        res.render('pokemon/index', { pokemon: results})
    })
});

router.post('/', function(req, res) {
    res.render('pokemon/index')
})

router.get("/:idx", (req,res)=>{
    const pokeIndex = parseInt(req.params.idx);
    pokeSelect = db.pokemon.findOne({ where: {id: pokeIndex} })
    .then(myPokemon => {
        res.render('pokemon/show', { myPokemon: myPokemon })
    })
})

router.get('/edit/:idx', (req, res) => {
    const editIndex = parseInt(req.params.idx);
    res.render('pokemon/edit', { pokeId: editIndex });
});

module.exports = router;