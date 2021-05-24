# Pokedex

## What it includes

* List of the Original 151 Pokemon
* Ability to create your own Pokemon
* Ability to edit any existing Pokemon however you would like to

### Pokemon Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| name | TEXT | Must be provided |
| types | TEXT | Must be provided |
| image | TEXT | Must be provided |
| id | Integer | Serial Primary Key|

### User Model

| Column Name | Data Type | Notes |
| --------------- | ------------- | ------------------------------ |
| id | Integer | Serial Primary Key, Auto-generated |
| name | String | Must be provided |
| email | String | Must be unique / used for login |
| password | String | Stored as a hash |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-generated |

### Default Routes

| Method | Path | Location | Purpose |
| ------ | ---------------- | -------------- | ------------------- |
| GET | / | server.js | Initial Home page |
| GET | /auth/login | auth.js | Login form |
| GET | /auth/signup | auth.js | Signup form |
| POST | /auth/login | auth.js | Login user |
| POST | /auth/signup | auth.js | Creates User |
| GET | /auth/logout | auth.js | Removes session info |
| GET | /profile | server.js | Regular User Profile |
| GET | /pokemon | pokemon.js | Pokemon Home Page |
| GET | /pokemon/:idx | pokemon.js | Displays Individual Pokemon Info |
| GET | /pokemon/edit/:idx | pokemon.js | Pokemon Edit Form |
| GET | /pokemon/new | pokemon.js | New Pokemon Form |
| PUT | /pokemon/:idx | pokemon.js | Update Pokemon Info |
| POST | /pokemon | pokemon.js | Add New Pokemon Info |
| DELETE | /pokemon/edit/:idx | pokemon.js | Deletes Pokemon Info |

The database is compiled via running seed.js once at the start.

```
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
```


The GET route on the Pokemon home page basically checks whether it is was redirected here via a search query through the form. If the search term exists in the current Pokedex, it will redirect to said Pokemon info page. Otherwise, it will send the user back to the Pokemon home page.

```
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
```

The POST route on the Pokemon home page updates the Pokemon list with the new Pokemon entry sent via the new Pokemon form.

```
router.get('/new', (req, res) => {
    res.render('pokemon/new');
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
```

Each individual Pokemon's information page is called via their id in the database.

```
router.get("/:idx", (req,res)=>{
    const pokeIndex = parseInt(req.params.idx);
    pokeSelect = db.pokemon.findOne({ where: {id: pokeIndex} })
    .then(myPokemon => {
        res.render('pokemon/show', { myPokemon: myPokemon })
    })
})
```

The edit is carried out via the submitted form.

```
router.get('/edit/:idx', (req, res) => {
    const editIndex = parseInt(req.params.idx);
    res.render('pokemon/edit', { pokeId: editIndex });
});

router.put('/:idx', async (req, res) => {
    const pokePick = parseInt(req.params.idx);
    const pokeEdit = await db.pokemon.findOne({ where: {id: pokePick } })   
    const { name, type } = req.body;
    pokeEdit.name = name;
    pokeEdit.types = type;
    await pokeEdit.save();
    res.redirect(`/pokemon/${pokePick}`);
})
```

On the edit page, the user can also delete the Pokemon.

```
router.delete('/edit/:idx', async(req, res) => {
    const delIndex = req.params.idx;
    const deletePoke = await db.pokemon.destroy({ where: {id: delIndex }
    })
    res.redirect('/pokemon');
})
```