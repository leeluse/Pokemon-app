export interface PokemonData {
  count: number;
  next: string | null;
  privious: string | null;
  result: PokemonNameAndUrl[]
}

export interface PokemonNameAndUrl {
  name: string;
  url: string;
}