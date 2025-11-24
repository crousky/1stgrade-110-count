import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shuffle, PenTool, Volume2, Eye } from 'lucide-react';

export default function Flashcards({ onBack }) {
    const [mode, setMode] = useState('menu'); // 'menu', 'ordered', 'random', 'writing'
    const [currentNumber, setCurrentNumber] = useState(0);
    const [isRevealed, setIsRevealed] = useState(true); // For writing mode

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    const startMode = (newMode) => {
        setMode(newMode);
        if (newMode === 'ordered') {
            setCurrentNumber(0);
            setIsRevealed(true);
        } else if (newMode === 'random') {
            setCurrentNumber(Math.floor(Math.random() * 111));
            setIsRevealed(true);
        } else if (newMode === 'writing') {
            nextWritingNumber();
        }
    };

    const nextCard = () => {
        if (mode === 'ordered') {
            if (currentNumber < 110) {
                setCurrentNumber(prev => prev + 1);
            } else {
                // Loop back or finish? Let's loop for now
                setCurrentNumber(0);
            }
        } else if (mode === 'random') {
            let next;
            do {
                next = Math.floor(Math.random() * 111);
            } while (next === currentNumber);
            setCurrentNumber(next);
        } else if (mode === 'writing') {
            nextWritingNumber();
        }
    };

    const nextWritingNumber = () => {
        const next = Math.floor(Math.random() * 111);
        setCurrentNumber(next);
        setIsRevealed(false);
        setTimeout(() => speak(next.toString()), 500);
    };

    const revealWriting = () => {
        setIsRevealed(true);
        speak(currentNumber.toString());
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={mode === 'menu' ? onBack : () => setMode('menu')}>
                    {mode === 'menu' ? '← Back' : '← Menu'}
                </button>
                <h2 className="title-font" style={{ margin: 0 }}>
                    {mode === 'menu' ? 'Flashcards' :
                        mode === 'ordered' ? 'In Order' :
                            mode === 'random' ? 'Mixed Up' : 'Writing Practice'}
                </h2>
                <div style={{ width: '80px' }}></div> {/* Spacer */}
            </div>

            {mode === 'menu' ? (
                <div className="glass-panel" style={{ display: 'grid', gap: '1rem', padding: '2rem' }}>
                    <button
                        onClick={() => startMode('ordered')}
                        style={{ fontSize: '1.5rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}
                    >
                        <ArrowRight size={32} /> In Order (0-110)
                    </button>
                    <button
                        onClick={() => startMode('random')}
                        style={{ fontSize: '1.5rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', background: 'var(--secondary)', color: 'white' }}
                    >
                        <Shuffle size={32} /> Mixed Up
                    </button>
                    <button
                        onClick={() => startMode('writing')}
                        style={{ fontSize: '1.5rem', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center', background: 'var(--accent)', color: 'var(--dark)' }}
                    >
                        <PenTool size={32} /> Writing Practice
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentNumber + (isRevealed ? '-rev' : '-hid')}
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="glass-panel"
                            style={{
                                width: '300px',
                                height: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8rem',
                                fontWeight: 'bold',
                                color: 'var(--dark)',
                                background: 'white',
                                borderRadius: '30px',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                            }}
                        >
                            {mode === 'writing' && !isRevealed ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <Volume2 size={64} color="var(--primary)" />
                                    <span style={{ fontSize: '1.5rem', fontWeight: 'normal' }}>Listen...</span>
                                    <button onClick={() => speak(currentNumber.toString())} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                                        Play Again
                                    </button>
                                </div>
                            ) : (
                                currentNumber
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {mode === 'writing' && !isRevealed ? (
                            <button
                                onClick={revealWriting}
                                style={{ fontSize: '1.5rem', padding: '1rem 3rem', background: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Eye /> Reveal
                            </button>
                        ) : (
                            <button
                                onClick={nextCard}
                                style={{ fontSize: '1.5rem', padding: '1rem 4rem', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                Next <ArrowRight />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
