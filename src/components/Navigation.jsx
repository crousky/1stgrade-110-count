import { motion } from 'framer-motion';
import { Grid3X3, Package, MessageCircle, Layers } from 'lucide-react';

const menuItems = [
    { id: 'chart', label: '110 Chart', icon: Grid3X3, color: '#FF6B6B' },
    { id: 'packer', label: 'Snack Packer', icon: Package, color: '#4ECDC4' },
    { id: 'rally', label: 'Rally Count', icon: MessageCircle, color: '#FFE66D' },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, color: '#95A5A6' },
];

export default function Navigation({ onSelect }) {
    return (
        <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 className="title-font" style={{ marginBottom: '2rem' }}>Choose an Activity!</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                padding: '1rem'
            }}>
                {menuItems.map((item) => (
                    <motion.button
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(item.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            border: 'none',
                            borderRadius: '20px',
                            background: item.color,
                            color: 'white',
                            fontSize: '1.5rem',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}
                    >
                        <item.icon size={48} style={{ marginBottom: '1rem' }} />
                        <span className="title-font">{item.label}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
