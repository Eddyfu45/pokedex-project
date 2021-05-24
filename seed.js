const fetch = require('node-fetch');
const axios = require('axios');
const db = require('./models');


let pokemonUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';
    axios.get(pokemonUrl)
    .then (response => {
        const pokeData = response.data.results;
        pokeData.forEach(poke => {
            let url = poke.url
            fetch(url)
            .then(response => response.json())
            .then(function(pokeData){
                let pokeTypes = pokeData.types;
                let typeArray = [];
                for(let i = 0; i < pokeTypes.length; i++) {
                    typeArray.push(pokeTypes[i].type.name);
                }
                let typeStr = typeArray.join('/');
                let testObj = { name: pokeData.name, types: typeStr, image: pokeData.sprites.front_default }
                db.pokemon.create(testObj);
            })
        })
    })
    .then(() => {
        db.pokemon.findAll()
        .then((results => {
            console.log(results)
        }))
    })