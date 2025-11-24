import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Chart110 from './components/Chart110';
import SnackPacker from './components/SnackPacker';
import RallyGame from './components/RallyGame';
import Flashcards from './components/Flashcards';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu');

  const renderView = () => {
    switch (currentView) {
      case 'chart':
        return <Chart110 onBack={() => setCurrentView('menu')} />;
      case 'packer':
        return <SnackPacker onBack={() => setCurrentView('menu')} />;
      case 'rally':
        return <RallyGame onBack={() => setCurrentView('menu')} />;
      case 'flashcards':
        return <Flashcards onBack={() => setCurrentView('menu')} />;
      default:
        return <Navigation onSelect={setCurrentView} />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="title-font" style={{ fontSize: '3rem', color: 'var(--primary)', margin: '0 0 1rem 0' }}>
          110 Counting Fun!
        </h1>
      </header>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
