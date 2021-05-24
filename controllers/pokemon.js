const express = require('express');
const router = express.Router();
const db = require('../models');
const { route } = require('./auth');
router.get('/new', (req, res) => {
    res.render('pokemon/new');
})

router.get('/', async function(req, res) {
    if (req.query.nameFilter) {
        const searchQuery = req.query.nameFilter;
        const searchPoke = await db.pokemon.findOne({ where: {name: searchQuery} });
        if (searchPoke) {
            res.redirect(`/pokemon/${searchPoke.id}`);
        } else {
            res.redirect('/pokemon');
        }
    } else (
    db.pokemon.findAll()
    .then((results) => {
        res.render('pokemon/index', { pokemon: results})
    }));
});

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

router.get('/new', (req, res) => {
    res.render('pokemon/new');
})

router.put('/:idx', async (req, res) => {
    const pokePick = parseInt(req.params.idx);
    const pokeEdit = await db.pokemon.findOne({ where: {id: pokePick } })   
    const { name, type } = req.body;
    pokeEdit.name = name;
    pokeEdit.types = type;
    await pokeEdit.save();
    res.redirect(`/pokemon/${pokePick}`);
})

router.post('/', async (req, res) => {
    newPokeName = req.body.name;
    newPokeType = req.body.type;
    newPokeImage = req.body.image;
    const newPokemon = {
        name: newPokeName,
        types: newPokeType,
        image: newPokeImage
    }
    const createPoke = await db.pokemon.create(newPokemon);
    res.redirect('/pokemon');
})

router.delete('/edit/:idx', async(req, res) => {
    const delIndex = req.params.idx;
    const deletePoke = await db.pokemon.destroy({ where: {id: delIndex }
    })
    res.redirect('/pokemon');
})



module.exports = router;