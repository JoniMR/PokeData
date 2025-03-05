export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  imgUrl: string;
  name: string;
  type: string[];
  height: number;
  weight: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface StatRange {
  min: number;
  max: number;
}
