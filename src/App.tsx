import { PokemonCard } from './components/PokemonCard';
import { PokemonGridSkeleton } from './components/LoadingSkeleton';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { Ghost } from 'lucide-react';

// TEMPORARY COMPONENT PREVIEW
// This file is strictly for QA of the core presentational components.

function App() {
  const handleCardClick = (name: string) => {
    console.log(`Clicked on ${name}`);
  };

  return (
    <div className="min-h-screen bg-appBg p-6 sm:p-10 text-slate-900 dark:text-slate-50">
      <div className="mx-auto max-w-7xl space-y-16">
        
        <header>
          <h1 className="text-4xl font-bold font-heading text-slate-900 dark:text-white">
            Component QA
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Testing grounds for Dexora core presentational components.
          </p>
        </header>

        {/* 1. Pokemon Cards */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold font-heading">Pokemon Cards (Interactive)</h2>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <PokemonCard
              id={4}
              name="charmander"
              image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
              types={['fire']}
              onClick={() => handleCardClick('charmander')}
            />
            <PokemonCard
              id={1}
              name="bulbasaur"
              image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
              types={['grass', 'poison']}
              onClick={() => handleCardClick('bulbasaur')}
            />
            <PokemonCard
              id={7}
              name="squirtle"
              image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
              types={['water']}
              onClick={() => handleCardClick('squirtle')}
            />
            <PokemonCard
              id={25}
              name="pikachu"
              image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              types={['electric']}
              onClick={() => handleCardClick('pikachu')}
            />
            <PokemonCard
              id={175}
              name="togepi"
              image="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png"
              types={['fairy']}
              onClick={() => handleCardClick('togepi')}
            />
          </div>
        </section>

        {/* 2. Loading Skeletons */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold font-heading">Loading Skeleton Grid</h2>
          <PokemonGridSkeleton count={5} />
        </section>

        {/* 3. Feedback States */}
        <section>
          <h2 className="mb-6 text-2xl font-semibold font-heading">Feedback States</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-surface p-6 shadow-soft">
              <ErrorState 
                message="We couldn't reach the Pokémon servers. Please check your internet connection and try again." 
                onRetry={() => console.log('Retrying...')} 
              />
            </div>
            
            <div className="rounded-3xl bg-surface p-6 shadow-soft">
              <EmptyState 
                title="No Pokémon Found" 
                subtitle="We searched far and wide, but couldn't find any Pokémon matching that description." 
              />
            </div>
            
            <div className="rounded-3xl bg-surface p-6 shadow-soft lg:col-span-2">
              <EmptyState 
                title="Ghost Type Box" 
                subtitle="It's completely empty in here..."
                icon={<Ghost className="h-10 w-10" strokeWidth={1.5} />}
              />
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}

export default App;
