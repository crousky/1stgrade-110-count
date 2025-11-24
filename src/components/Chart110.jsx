import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Circle, Square, Triangle, Eraser, Highlighter, Stamp, RotateCcw } from 'lucide-react';

const STICKERS = [
    { id: 'star', icon: Star, color: '#FFD700' },
    { id: 'heart', icon: Heart, color: '#FF6B6B' },
    { id: 'circle', icon: Circle, color: '#4ECDC4' },
    { id: 'square', icon: Square, color: '#95A5A6' },
    { id: 'triangle', icon: Triangle, color: '#FFE66D' },
];

export default function Chart110({ onBack }) {
    const [mode, setMode] = useState('highlight'); // 'highlight' | 'sticker'
    const [selectedSticker, setSelectedSticker] = useState(STICKERS[0]);
    const [gridState, setGridState] = useState({}); // { [number]: { highlighted: boolean, sticker: stickerId } }

    const numbers = Array.from({ length: 110 }, (_, i) => i + 1);

    const handleCellClick = (number) => {
        setGridState(prev => {
            const cell = prev[number] || {};
            if (mode === 'highlight') {
                return {
                    ...prev,
                    [number]: { ...cell, highlighted: !cell.highlighted }
                };
            } else if (mode === 'sticker') {
                // If clicking with same sticker, remove it. If different, replace it.
                const newSticker = cell.sticker === selectedSticker.id ? null : selectedSticker.id;
                return {
                    ...prev,
                    [number]: { ...cell, sticker: newSticker }
                };
            }
            return prev;
        });
    };

    const clearChart = () => {
        if (window.confirm('Clear the entire chart?')) {
            setGridState({});
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onBack}>← Back</button>
                <h2 className="title-font" style={{ margin: 0 }}>110 Chart</h2>
                <button onClick={clearChart} style={{ background: '#FF6B6B', color: 'white' }}>
                    <RotateCcw size={16} style={{ marginRight: '0.5rem' }} /> Clear
                </button>
            </div>

            <div className="glass-panel" style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
                {/* Controls */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setMode('highlight')}
                        style={{
                            background: mode === 'highlight' ? 'var(--secondary)' : 'white',
                            color: mode === 'highlight' ? 'white' : 'var(--dark)',
                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        <Highlighter size={20} /> Highlight Mode
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'white', padding: '0.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem' }}>
                            <Stamp size={20} /> Sticker Mode:
                        </div>
                        {STICKERS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => { setMode('sticker'); setSelectedSticker(s); }}
                                style={{
                                    padding: '0.5rem',
                                    background: (mode === 'sticker' && selectedSticker.id === s.id) ? '#eee' : 'transparent',
                                    border: (mode === 'sticker' && selectedSticker.id === s.id) ? '2px solid var(--primary)' : '1px solid transparent',
                                    boxShadow: 'none'
                                }}
                            >
                                <s.icon color={s.color} fill={s.color} size={24} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(10, 1fr)',
                    gap: '4px',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '12px'
                }}>
                    {numbers.map(num => {
                        const cell = gridState[num] || {};
                        const StickerIcon = cell.sticker ? STICKERS.find(s => s.id === cell.sticker)?.icon : null;
                        const stickerColor = cell.sticker ? STICKERS.find(s => s.id === cell.sticker)?.color : null;

                        return (
                            <motion.button
                                key={num}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCellClick(num)}
                                style={{
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    background: cell.highlighted ? 'var(--accent)' : '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '8px',
                                    padding: 0,
                                    position: 'relative',
                                    color: 'var(--dark)',
                                    boxShadow: 'none'
                                }}
                            >
                                <span style={{ opacity: cell.sticker ? 0.3 : 1 }}>{num}</span>
                                {StickerIcon && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        style={{ position: 'absolute' }}
                                    >
                                        <StickerIcon color={stickerColor} fill={stickerColor} size={28} />
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
