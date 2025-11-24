import { useState } from 'react';
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Apple, Pizza, Candy, Carrot, EyeOff, Eye, Shuffle, Trash2, Dices } from 'lucide-react';

const SNACKS = [
    { id: 'cookie', icon: Cookie, color: '#D35400', label: 'Cookie' },
    { id: 'apple', icon: Apple, color: '#E74C3C', label: 'Apple' },
    { id: 'pizza', icon: Pizza, color: '#F39C12', label: 'Pizza' },
    { id: 'candy', icon: Candy, color: '#9B59B6', label: 'Candy' },
    { id: 'carrot', icon: Carrot, color: '#E67E22', label: 'Carrot' },
];

function DraggableItem({ id, type, style }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    const SnackType = SNACKS.find(s => s.id === type);
    const Icon = SnackType ? SnackType.icon : Cookie;
    const color = SnackType ? SnackType.color : '#000';

    const transformStyle = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : {};

    return (
        <div ref={setNodeRef} style={{ ...style, ...transformStyle, touchAction: 'none', cursor: 'grab' }} {...listeners} {...attributes}>
            <Icon size={48} color={color} fill={color} />
        </div>
    );
}

export default function SnackPacker({ onBack }) {
    const [items, setItems] = useState([]); // { id, type, x, y }
    const [isHidden, setIsHidden] = useState(false);

    const addItem = (type) => {
        const newItem = {
            id: `${type}-${Date.now()}`,
            type,
            x: Math.random() * 200, // Random initial position within a range
            y: Math.random() * 200,
        };
        setItems(prev => [...prev, newItem]);
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;
        setItems(prev => prev.map(item => {
            if (item.id === active.id) {
                return {
                    ...item,
                    x: item.x + delta.x,
                    y: item.y + delta.y,
                };
            }
            return item;
        }));
    };

    const shuffleItems = () => {
        setItems(prev => prev.map(item => ({
            ...item,
            x: Math.random() * 300 - 150, // Spread out
            y: Math.random() * 300 - 150,
        })));
    };

    const randomFill = () => {
        let newItems = [];
        // Generate a random total between 20 and 110
        const targetTotal = Math.floor(Math.random() * 91) + 20;

        // Distribute roughly among available snacks
        while (newItems.length < targetTotal) {
            const randomSnack = SNACKS[Math.floor(Math.random() * SNACKS.length)];
            newItems.push({
                id: `${randomSnack.id}-${Date.now()}-${newItems.length}`,
                type: randomSnack.id,
                x: Math.random() * 300 - 150,
                y: Math.random() * 300 - 150,
            });
        }
        setItems(newItems);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={onBack}>← Back</button>
                <h2 className="title-font" style={{ margin: 0 }}>Snack Packer</h2>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    Count: {items.length}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>
                {/* Pantry */}
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 className="title-font">Pantry</h3>
                    {SNACKS.map(snack => (
                        <button
                            key={snack.id}
                            onClick={() => addItem(snack.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-start' }}
                        >
                            <snack.icon color={snack.color} /> Add {snack.label}
                        </button>
                    ))}
                    <div style={{ flexGrow: 1 }}></div>
                    <button onClick={randomFill} style={{ background: 'var(--accent)', color: 'var(--dark)' }}>
                        <Dices size={16} /> Surprise Me!
                    </button>
                    <button onClick={() => setItems([])} style={{ background: '#FF6B6B', color: 'white' }}>
                        <Trash2 size={16} /> Clear All
                    </button>
                </div>

                {/* Lunchbox */}
                <div className="glass-panel" style={{ position: 'relative', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>

                    {/* Controls Overlay */}
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 20, display: 'flex', gap: '0.5rem' }}>
                        <button onClick={shuffleItems} title="Rearrange">
                            <Shuffle size={20} />
                        </button>
                        <button onClick={() => setIsHidden(!isHidden)} title={isHidden ? "Show" : "Hide"}>
                            {isHidden ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>

                    {/* Content */}
                    <AnimatePresence>
                        {isHidden ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute', inset: 0, background: 'var(--dark)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white', flexDirection: 'column', zIndex: 10, borderRadius: '16px'
                                }}
                            >
                                <h2 className="title-font" style={{ fontSize: '3rem' }}>?</h2>
                                <p>How many snacks are inside?</p>
                            </motion.div>
                        ) : (
                            <DndContext onDragEnd={handleDragEnd}>
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    {items.map(item => (
                                        <DraggableItem
                                            key={item.id}
                                            id={item.id}
                                            type={item.type}
                                            style={{
                                                position: 'absolute',
                                                left: '50%',
                                                top: '50%',
                                                marginLeft: item.x,
                                                marginTop: item.y
                                            }}
                                        />
                                    ))}
                                </div>
                            </DndContext>
                        )}
                    </AnimatePresence>

                    {items.length === 0 && !isHidden && (
                        <div style={{ opacity: 0.5, pointerEvents: 'none' }}>
                            Add snacks from the pantry!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
