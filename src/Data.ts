//const fs = require('fs');
//const jsonPokemonTypes: any = JSON.parse(fs.readFileSync("./src/types.json", { encoding: "utf8", flag: 'r' }));

export interface PokemonTypeData{
    reaction:string
    immunes:Array<string>
    weaknesses:Array<string>
    strengths:Array<string>
}
export interface PokemonTypeChart{
    normal:PokemonTypeData
    fire:PokemonTypeData
    water:PokemonTypeData
    electric:PokemonTypeData
    grass:PokemonTypeData
    ice:PokemonTypeData
    fighting:PokemonTypeData
    poison:PokemonTypeData
    ground:PokemonTypeData
    flying:PokemonTypeData
    psychic:PokemonTypeData
    bug:PokemonTypeData
    rock:PokemonTypeData
    ghost:PokemonTypeData
    dragon:PokemonTypeData
    dark:PokemonTypeData
    steel:PokemonTypeData
    fairy:PokemonTypeData
    missing:PokemonTypeData
}
const PokemonTypeDataObject:PokemonTypeChart = {
    normal: {
        reaction: '😀',
        immunes: [
            'ghost'
        ],
        weaknesses: [
            'rock',
            'steel'
        ],
        strengths: []
    },
    fire: {
        reaction: '🔥',
        immunes: [],
        weaknesses: [
            'fire',
            'water',
            'rock',
            'dragon'
        ],
        strengths: [
            'grass',
            'ice',
            'bug',
            'steel'
        ]
    },
    water: {
        reaction: '🌊',
        immunes: [],
        weaknesses: [
            'water',
            'grass',
            'dragon'
        ],
        strengths: [
            'fire',
            'ground',
            'rock'
        ]
    },
    electric: {
        reaction: '🔋',
        immunes: [
            'ground'
        ],
        weaknesses: [
            'electric',
            'grass',
            'dragon'
        ],
        strengths: [
            'water',
            'flying'
        ]
    },
    grass: {
        reaction: '🌿',
        immunes: [],
        weaknesses: [
            'fire',
            'grass',
            'poison',
            'flying',
            'bug',
            'dragon',
            'steel'
        ],
        strengths: [
            'water',
            'ground',
            'rock'
        ]
    },
    ice: {
        reaction: '🧊',
        immunes: [],
        weaknesses: [
            'fire',
            'water',
            'ice',
            'steel'
        ],
        strengths: [
            'grass',
            'ground',
            'flying',
            'dragon'
        ]
    },
    fighting: {
        reaction: '👊🏻',
        immunes: [
            'ghost'
        ],
        weaknesses: [
            'poison',
            'flying',
            'psychic',
            'bug',
            'fairy'
        ],
        strengths: [
            'normal',
            'ice',
            'rock',
            'dark',
            'steel'
        ]
    },
    poison: {
        reaction: '☠️',
        immunes: [
            'steel'
        ],
        weaknesses: [
            'poison',
            'ground',
            'rock',
            'ghost'
        ],
        strengths: [
            'grass',
            'fairy'
        ]
    },
    ground: {
        reaction: '⛱️',
        immunes: [
            'flying'
        ],
        weaknesses: [
            'grass',
            'bug'
        ],
        strengths: [
            'fire',
            'electric',
            'poison',
            'rock',
            'steel'
        ]
    },
    flying: {
        reaction: '🐔',
        immunes: [],
        weaknesses: [
            'electric',
            'rock',
            'steel'
        ],
        strengths: [
            'grass',
            'fighting',
            'bug'
        ]
    },
    psychic: {
        reaction: '👁️',
        immunes: [
            'dark'
        ],
        weaknesses: [
            'psychic',
            'steel'
        ],
        strengths: [
            'fighting',
            'poison'
        ]
    },
    bug: {
        reaction: '🐛',
        immunes: [],
        weaknesses: [
            'fire',
            'fighting',
            'poison',
            'flying',
            'ghost',
            'steel',
            'fairy'
        ],
        strengths: [
            'grass',
            'psychic',
            'dark'
        ]
    },
    rock: {
        reaction: '⛰️',
        immunes: [],
        weaknesses: [
            'fighting',
            'ground',
            'steel'
        ],
        strengths: [
            'fire',
            'ice',
            'flying',
            'bug'
        ]
    },
    ghost: {
        reaction: '👻',
        immunes: [
            'normal'
        ],
        weaknesses: [
            'dark'
        ],
        strengths: [
            'psychic',
            'ghost'
        ]
    },
    dragon: {
        reaction: '🐉',
        immunes: [
            'fairy'
        ],
        weaknesses: [
            'steel'
        ],
        strengths: [
            'dragon'
        ]
    },
    dark: {
        reaction: '👿',
        immunes: [],
        weaknesses: [
            'fighting',
            'dark',
            'fairy'
        ],
        strengths: [
            'psychic',
            'ghost'
        ]
    },
    steel: {
        reaction: '⚙️',
        immunes: [],
        weaknesses: [
            'fire',
            'water',
            'electric',
            'steel'
        ],
        strengths: [
            'ice',
            'rock',
            'fairy'
        ]
    },
    fairy: {
        reaction: '🧚',
        immunes: [],
        weaknesses: [
            'fire',
            'poison',
            'steel'
        ],
        strengths: [
            'fighting',
            'dragon',
            'dark'
        ]
    },
    missing: {
        reaction: '❔',
        immunes: [],
        weaknesses: [],
        strengths: []
    }
};
const PokemonTypeDataMap = new Map<string, PokemonTypeData>();
PokemonTypeDataMap.set("normal", PokemonTypeDataObject.normal);
PokemonTypeDataMap.set("bug", PokemonTypeDataObject.bug);
PokemonTypeDataMap.set("dark", PokemonTypeDataObject.dark);
PokemonTypeDataMap.set("dragon", PokemonTypeDataObject.dragon);
PokemonTypeDataMap.set("electric", PokemonTypeDataObject.electric);
PokemonTypeDataMap.set("fairy", PokemonTypeDataObject.fairy);
PokemonTypeDataMap.set("fighting", PokemonTypeDataObject.fighting);
PokemonTypeDataMap.set("fire", PokemonTypeDataObject.fire);
PokemonTypeDataMap.set("flying", PokemonTypeDataObject.flying);
PokemonTypeDataMap.set("ghost", PokemonTypeDataObject.ghost);
PokemonTypeDataMap.set("grass", PokemonTypeDataObject.grass);
PokemonTypeDataMap.set("ground", PokemonTypeDataObject.ground);
PokemonTypeDataMap.set("ice", PokemonTypeDataObject.ice);
PokemonTypeDataMap.set("poison", PokemonTypeDataObject.poison);
PokemonTypeDataMap.set("psychic", PokemonTypeDataObject.psychic);
PokemonTypeDataMap.set("rock", PokemonTypeDataObject.rock);
PokemonTypeDataMap.set("steel", PokemonTypeDataObject.steel);
PokemonTypeDataMap.set("water", PokemonTypeDataObject.water);
export {PokemonTypeDataObject, PokemonTypeDataMap};