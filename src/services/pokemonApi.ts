import { Pokemon, PokemonListResponse, PokemonListItem, PokemonTypeResponse } from '@/types/pokemon';
import { PokemonApiError } from '@/utils/errors';

const BASE_URL = 'https://pokeapi.co/api/v2';

async function fetchWithHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new PokemonApiError('Pokémon not found', 404);
      }
      throw new PokemonApiError(`API Error: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof PokemonApiError) {
      throw error;
    }
    throw new PokemonApiError(error instanceof Error ? error.message : 'Network error occurred');
  }
}

export async function getPokemonList(limit: number = 20, offset: number = 0): Promise<PokemonListResponse> {
  return fetchWithHandling<PokemonListResponse>(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
}

export async function getPokemonDetail(nameOrId: string | number): Promise<Pokemon> {
  const normalizedInput = String(nameOrId).trim().toLowerCase();
  
  if (!normalizedInput) {
    throw new PokemonApiError('Invalid Pokémon name or ID provided', 400);
  }

  return fetchWithHandling<Pokemon>(`${BASE_URL}/pokemon/${normalizedInput}`);
}

export async function getPokemonByType(type: string): Promise<PokemonListItem[]> {
  const normalizedType = type.trim().toLowerCase();
  
  if (!normalizedType) {
    throw new PokemonApiError('Invalid Pokémon type provided', 400);
  }

  const data = await fetchWithHandling<PokemonTypeResponse>(`${BASE_URL}/type/${normalizedType}`);
  return data.pokemon.map((p) => p.pokemon);
}
