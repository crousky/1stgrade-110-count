import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Play, RotateCcw } from 'lucide-react';

export default function RallyGame({ onBack }) {
    const [currentNumber, setCurrentNumber] = useState(0);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false); // false = bot starts (says 1)
    const [gameActive, setGameActive] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const speak = (text) => {
        if (soundEnabled && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    const startGame = () => {
        setGameActive(true);
        setCurrentNumber(0);
        setIsPlayerTurn(false); // Bot goes first: "1"
        setTimeout(botTurn, 500);
    };

    const botTurn = () => {
        const nextNum = currentNumber + 1;
        if (nextNum > 110) {
            endGame();
            return;
        }

        // Bot "thinks" then speaks
        setTimeout(() => {
            setCurrentNumber(nextNum);
            speak(nextNum.toString());
            setIsPlayerTurn(true);
            setUserInput('');
            setAttempts(0);
        }, 1000);
    };

    const handleNumberClick = (num) => {
        if (userInput.length < 3) {
            setUserInput(prev => prev + num);
        }
    };

    const handleBackspace = () => {
        setUserInput(prev => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        const correct = currentNumber + 1;
        const userNum = parseInt(userInput, 10);

        if (userNum === correct) {
            // Correct!
            setCurrentNumber(userNum);
            speak(userNum.toString());

            if (userNum === 110) {
                endGame();
            } else {
                setIsPlayerTurn(false);
                botTurn();
            }
        } else {
            // Incorrect
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 2) {
                // Second wrong attempt: Show answer and move on
                speak(`The answer is ${correct}`);
                setTimeout(() => {
                    setCurrentNumber(correct);
                    setIsPlayerTurn(false);
                    botTurn();
                }, 2000);
            } else {
                // First wrong attempt: Try again
                speak("Try again");
                setUserInput('');
                // Shake effect could be added here
            }
        }
    };

    const endGame = () => {
        setGameActive(false);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        speak("We did it! Great counting!");
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onBack}>← Back</button>
                <h2 className="title-font" style={{ margin: 0 }}>Rally Count</h2>
                <button onClick={() => setSoundEnabled(!soundEnabled)}>
                    {soundEnabled ? <Volume2 /> : <VolumeX />}
                </button>
            </div>

            <div className="glass-panel" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {!gameActive ? (
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Ready to count to 110?</h3>
                        <p style={{ marginBottom: '2rem' }}>I'll say a number, then you type the next one!</p>
                        <button
                            onClick={startGame}
                            style={{ fontSize: '1.5rem', padding: '1rem 2rem', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 auto' }}
                        >
                            <Play fill="white" /> Start Game
                        </button>
                    </div>
                ) : (
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', color: '#888', marginBottom: '0.5rem' }}>
                                Current Number
                            </div>
                            <motion.div
                                key={currentNumber}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ fontSize: '6rem', fontWeight: 'bold', color: 'var(--dark)' }}
                            >
                                {currentNumber}
                            </motion.div>
                        </div>

                        {isPlayerTurn ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    fontSize: '3rem',
                                    minHeight: '4rem',
                                    borderBottom: '2px solid var(--primary)',
                                    padding: '0 1rem',
                                    marginBottom: '1rem',
                                    color: attempts > 0 ? 'var(--primary)' : 'var(--dark)'
                                }}>
                                    {userInput || (attempts > 0 ? 'Try Again' : '_')}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', width: '100%', maxWidth: '300px' }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => handleNumberClick(num)}
                                            style={{
                                                fontSize: '1.5rem',
                                                padding: '1rem',
                                                background: 'white',
                                                border: '1px solid #eee',
                                                gridColumn: num === 0 ? '2' : 'auto'
                                            }}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleBackspace}
                                        style={{ gridColumn: '1', gridRow: '4', background: '#f8d7da', color: '#721c24' }}
                                    >
                                        ⌫
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        style={{ gridColumn: '3', gridRow: '4', background: '#d4edda', color: '#155724' }}
                                    >
                                        ✓
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#888', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >
                                    Bot is thinking...
                                </motion.div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
