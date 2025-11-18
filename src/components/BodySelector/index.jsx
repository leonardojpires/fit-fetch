import { useState } from 'react';
import './style.css';

function BodySelector({ onMuscleSelect }) {
    const [selected, setSelected] = useState([]);
    const [hoveredMuscle, setHoveredMuscle] = useState(null);

    const muscleData = {
        'ombros': {
            name: 'Ombros',
            emoji: '🏔️',
            color: '#FF6B6B',
            description: 'Deltoides'
        },
        'peito': {
            name: 'Peito',
            emoji: '💪',
            color: '#4ECDC4',
            description: 'Peitoral'
        },
        'biceps': {
            name: 'Bíceps',
            emoji: '💥',
            color: '#95E1D3',
            description: 'Braços Frontais'
        },
        'triceps': {
            name: 'Tríceps',
            emoji: '⚡',
            color: '#F38181',
            description: 'Braços Traseiros'
        },
        'costas': {
            name: 'Costas',
            emoji: '🛡️',
            color: '#AA96DA',
            description: 'Dorsais'
        },
        'pernas': {
            name: 'Pernas',
            emoji: '🦵',
            color: '#FCBAD3',
            description: 'Membros Inferiores'
        }
    };

    const toggleMuscle = (muscleId) => {
        let newSelected;
        if (selected.includes(muscleId)) {
            newSelected = selected.filter(id => id !== muscleId);
        } else {
            newSelected = [...selected, muscleId];
        }
        setSelected(newSelected);
        if (onMuscleSelect) {
            onMuscleSelect(newSelected);
        }
    };

    const isMuscleSelected = (muscleId) => selected.includes(muscleId);

    return (
        <div className="body-selector-epic">
            {/* Header com info */}
            <div className="selector-header">
                <h3 className="header-title">Seleciona os Teus Músculos</h3>
                <p className="header-subtitle">Clica para construir o teu treino personalizado</p>
            </div>

            {/* Grid de Músculos - Estilo Moderno */}
            <div className="muscles-container">
                {Object.entries(muscleData).map(([id, data]) => (
                    <div
                        key={id}
                        className={`muscle-card-epic ${isMuscleSelected(id) ? 'selected' : ''} ${hoveredMuscle === id ? 'hovered' : ''}`}
                        onClick={() => toggleMuscle(id)}
                        onMouseEnter={() => setHoveredMuscle(id)}
                        onMouseLeave={() => setHoveredMuscle(null)}
                        style={{
                            '--muscle-color': data.color,
                            '--muscle-color-dark': data.color + 'CC'
                        }}
                    >
                        {/* Badge de selecionado */}
                        {isMuscleSelected(id) && (
                            <div className="selected-indicator">
                                <span className="indicator-check">✓</span>
                            </div>
                        )}

                        {/* Emoji grande */}
                        <div className="muscle-emoji">{data.emoji}</div>

                        {/* Nome principal */}
                        <div className="muscle-name-epic">{data.name}</div>

                        {/* Descrição */}
                        <div className="muscle-description">{data.description}</div>

                        {/* Barra de cor no fundo */}
                        <div className="color-bar"></div>

                        {/* Efeito de brilho ao hover */}
                        <div className="shine-effect"></div>
                    </div>
                ))}
            </div>

            {/* Resumo Visual */}
            {selected.length > 0 && (
                <div className="selection-summary">
                    <div className="summary-header">
                        <span className="summary-icon">🎯</span>
                        <span className="summary-text">
                            {selected.length} {selected.length === 1 ? 'grupo muscular selecionado' : 'grupos musculares selecionados'}
                        </span>
                    </div>
                    
                    <div className="selected-pills">
                        {selected.map(muscleId => {
                            const data = muscleData[muscleId];
                            return (
                                <div
                                    key={muscleId}
                                    className="muscle-pill"
                                    style={{ '--pill-color': data.color }}
                                    onClick={() => toggleMuscle(muscleId)}
                                >
                                    <span className="pill-emoji">{data.emoji}</span>
                                    <span className="pill-name">{data.name}</span>
                                    <span className="pill-remove">×</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Mensagem motivacional */}
            {selected.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🏋️</div>
                    <p className="empty-text">Começa a selecionar os músculos que queres trabalhar!</p>
                </div>
            )}
        </div>
    );
}

export default BodySelector;
