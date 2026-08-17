export class PokemonApiError extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'PokemonApiError';
    this.status = status;
    
    // Set the prototype explicitly for correct prototype chain in TypeScript/ES6
    Object.setPrototypeOf(this, PokemonApiError.prototype);
  }
}
