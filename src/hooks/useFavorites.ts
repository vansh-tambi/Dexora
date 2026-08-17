import { useState, useEffect, useCallback } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dexora-favorites');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dexora-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((name: string) => {
    setFavorites((prev) => {
      const normalized = name.toLowerCase().trim();
      if (prev.includes(normalized)) {
        return prev.filter((fav) => fav !== normalized);
      } else {
        return [...prev, normalized];
      }
    });
  }, []);

  const isFavorite = useCallback((name: string) => {
    return favorites.includes(name.toLowerCase().trim());
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
