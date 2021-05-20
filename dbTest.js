const axios = require('axios');
const fetch = require('node-fetch');

// let pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/';
//   // Use request to call the API
// axios.get(pokemonUrl).then(response => {
//     console.log(response.data.results)
// })

function fetchKantoPokemon(){
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1')
     .then(response => response.json())
     .then(function(allpokemon){
     allpokemon.results.forEach(function(pokemon){
       fetchPokemonData(pokemon); 
     })
    })
}
function fetchPokemonData(pokemon){
    let url = pokemon.url
      fetch(url)
      .then(response => response.json())
      .then(function(pokeData){
        console.log(pokeData.name);
        pokeData.types.forEach(typeCase => console.log('Type: ' + typeCase.type.name));
        console.log(pokeData.sprites.front_default);
      })
}
fetchKantoPokemon();

<form method="POST" action="/pokemon">
      <input hidden type="text" name="name" value="<%= pokemon.name %>">
      <button class="btn btn-primary" type="submit">Add to Favorite Pokemon</button>
    </form>