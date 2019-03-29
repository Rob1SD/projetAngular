
  export class PokemonPreview {
  
      public nom: string;
      public frontImage: string;
      public selected1 : boolean;
        public selected2 : boolean;
  
      constructor(nom : string) {
        this.nom = nom;
        this.frontImage = "https://play.pokemonshowdown.com/sprites/xyani/"+this.nom+".gif";
        this.selected1 = false;
        this.selected2 = false;
      }
  }
  
  
  