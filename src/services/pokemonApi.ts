import type { Pokemon, PokemonListResponse, PokemonListItem, PokemonTypeResponse } from '@/types/pokemon';
import { PokemonApiError } from '@/utils/errors';

const BASE_URL = import.meta.env.VITE_POKEMON_API_BASE_URL || 'https://pokeapi.co/api/v2';

// In-Memory Cache for successful Pokémon detail requests
const detailCache = new Map<string, Pokemon>();

async function fetchWithHandling<T>(url: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(url, { signal });
    
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
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    throw new PokemonApiError(error instanceof Error ? error.message : 'Network error occurred');
  }
}

export async function getPokemonList(
  limit: number = 20,
  offset: number = 0,
  signal?: AbortSignal
): Promise<PokemonListResponse> {
  return fetchWithHandling<PokemonListResponse>(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, signal);
}

export async function getPokemonDetail(nameOrId: string | number, signal?: AbortSignal): Promise<Pokemon> {
  const normalizedInput = String(nameOrId).trim().toLowerCase();
  
  if (!normalizedInput) {
    throw new PokemonApiError('Invalid Pokémon name or ID provided', 400);
  }

  // Check In-Memory Cache first
  if (detailCache.has(normalizedInput)) {
    return detailCache.get(normalizedInput)!;
  }

  // Fetch from API if not in cache
  const pokemon = await fetchWithHandling<Pokemon>(`${BASE_URL}/pokemon/${normalizedInput}`, signal);
  
  // Cache successful result under normalized query, name, and ID
  detailCache.set(normalizedInput, pokemon);
  detailCache.set(pokemon.name.toLowerCase(), pokemon);
  detailCache.set(String(pokemon.id), pokemon);

  return pokemon;
}

export async function getPokemonByType(type: string, signal?: AbortSignal): Promise<PokemonListItem[]> {
  const normalizedType = type.trim().toLowerCase();
  
  if (!normalizedType) {
    throw new PokemonApiError('Invalid Pokémon type provided', 400);
  }

  const data = await fetchWithHandling<PokemonTypeResponse>(`${BASE_URL}/type/${normalizedType}`, signal);
  return data.pokemon.map((p) => p.pokemon);
}
