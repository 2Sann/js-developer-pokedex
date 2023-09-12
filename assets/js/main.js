// Elemento HTML do popup
const popupHTML = `
    <div class="popup" id="pokemonPopup">
        <div class="popup-content gradient-border">
            <span class="popup-close-button" id="closePopupButton">&times;</span>
            <span class="pokedex-number"></span>
            <span class="pokemon-name"></span>
            <span class="pokemon-types"></span>
            <span class="popup-upper"></span>
            <div class="pokemon-stats"></div> 
            <div class="popup-lower">
                <ul class="pokemon-stats">
                    <li>
                        <span class="stat-label">HP:</span>
                        <span class="stat-value" id="hp"></span>
                    </li>
                    <li>
                        <span class="stat-label">Attack:</span>
                        <span class="stat-value" id="attack"></span>
                    </li>
                    <li>
                        <span class="stat-label">Defense:</span>
                        <span class="stat-value" id="defense"></span>
                    </li>
                    <li>
                        <span class="stat-label">Special Attack:</span>
                        <span class="stat-value" id="special-attack"></span>
                    </li>
                    <li>
                        <span class="stat-label">Special Defense:</span>
                        <span class="stat-value" id="special-defense"></span>
                    </li>
                    <li>
                        <span class="stat-label">Speed:</span>
                        <span class="stat-value" id="speed"></span>
                    </li>
                </ul>
                <div class="pokemon-details">
                    <div class="pokemon-detail">
                        <span class="detail-label">Height:</span>
                        <span class="detail-value" id="height"></span>
                    </div>
                    <div class="pokemon-detail">
                        <span class="detail-label">Weight:</span>
                        <span class="detail-value" id="weight"></span>
                    </div>
                </div>
            </div>          
        </div>
    </div>
`;

document.body.innerHTML += popupHTML;

const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const popup = document.getElementById('pokemonPopup');

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

// Inicialização
popup.style.display = 'none';
loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

pokemonList.addEventListener('click', (event) => {
    const pokemonClicked = event.target.closest('.pokemon');
    if (pokemonClicked) {
        const backgroundColor = getComputedStyle(pokemonClicked).backgroundColor;
        const pokemonImage = pokemonClicked.querySelector('img').getAttribute('src');
        const pokemonNumber = pokemonClicked.querySelector('.number').textContent;
        const pokemonName = pokemonClicked.querySelector('.name').textContent;
        const pokemonTypes = [...pokemonClicked.querySelectorAll('.type')].map((type) => type.textContent);

        popup.style.setProperty('--upper-background', backgroundColor);
        popup.style.setProperty('--upper-image', `url(${pokemonImage})`);

        const pokedexNumber = popup.querySelector('.pokedex-number');
        pokedexNumber.textContent = pokemonNumber;

        const pokemonNameElement = popup.querySelector('.pokemon-name');
        pokemonNameElement.textContent = pokemonName;

        const pokemonTypesDiv = popup.querySelector('.pokemon-types');
        pokemonTypesDiv.innerHTML = '';

        pokemonTypes.forEach((type) => {
            const typeElement = document.createElement('span');
            typeElement.textContent = type;
            typeElement.classList.add('type-label', type);
            pokemonTypesDiv.appendChild(typeElement);
        });

        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}/`)
            .then((response) => response.json())
            .then((data) => {
                // Dados de status
                document.getElementById('hp').textContent = data.stats[0].base_stat;
                document.getElementById('attack').textContent = data.stats[1].base_stat;
                document.getElementById('defense').textContent = data.stats[2].base_stat;
                document.getElementById('special-attack').textContent = data.stats[3].base_stat;
                document.getElementById('special-defense').textContent = data.stats[4].base_stat;
                document.getElementById('speed').textContent = data.stats[5].base_stat;
                // Outras estatísticas aqui
                document.getElementById('height').textContent = `${data.height / 10} m`;
                document.getElementById('weight').textContent = `${data.weight / 10} kg`; 
            });
        
        popup.style.display = 'block';
    }
});

const closePopupButton = document.getElementById('closePopupButton');
closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
});