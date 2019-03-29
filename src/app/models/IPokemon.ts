export interface IPokemon {
    abilities: Ability[];
    base_experience: number;
    forms: NamedResource[];
    game_indices: Gameindex[];
    height: number;
    held_items: Helditem[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: Move[];
    name: string;
    order: number;
    species: NamedResource;
    sprites: Sprites;
    stats: Stat[];
    types: Type[];
    weight: number;
  }
  export interface ISpecies {
    color : IColor;

  }
  export interface IColor {
    name: string;
    url: string;
  }
  interface Type {
    slot: number;
    type: NamedResource;
  }
  
  interface Stat {
    base_stat: number;
    effort: number;
    stat: NamedResource;
  }
  
  interface Sprites {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
  }
  
  interface Move {
    move: NamedResource;
    version_group_details: Versiongroupdetail[];
  }
  
  interface Versiongroupdetail {
    level_learned_at: number;
    move_learn_method: NamedResource;
    version_group: NamedResource;
  }
  
  interface Helditem {
    item: NamedResource;
    version_details: Versiondetail[];
  }
  
  interface Versiondetail {
    rarity: number;
    version: NamedResource;
  }
  
  interface Gameindex {
    game_index: number;
    version: NamedResource;
  }
  
  interface Ability {
    ability: NamedResource;
    is_hidden: boolean;
    slot: number;
  }
  
  interface NamedResource {
    name: string;
    url: string;
  }
