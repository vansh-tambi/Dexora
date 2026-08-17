import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CustomCursor } from './components/CustomCursor';

function App() {
  return (
    <BrowserRouter>
      {/* 3-Layer Background System */}
      <div className="relative min-h-screen bg-appBg text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
        {/* Custom Pokéball Cursor */}
        <CustomCursor />

        {/* Layer 2: Dot-Grid Texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-100" />
        
        {/* Layer 3: Ambient Color Blobs */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          {/* Top-Left Red Blob */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-500/8 blur-[100px] dark:bg-red-500/4" />
          {/* Bottom-Right Gold Blob */}
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/8 blur-[100px] dark:bg-amber-500/4" />
          {/* Middle-Left Blue Blob */}
          <div className="absolute left-[-10%] top-[40%] h-80 w-80 rounded-full bg-blue-500/5 blur-[80px] dark:bg-blue-500/2.5" />
        </div>

        {/* Content Outlet Layer */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon/:name" element={<Home />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
