import { useState } from 'react';
import { GiShoulderArmor, GiBiceps, GiMuscleUp, GiLeg } from 'react-icons/gi';
import { FaDumbbell } from 'react-icons/fa';
import { IoBodySharp } from 'react-icons/io5';
import './style.css';

function BodySelector({ onMuscleSelect, isDisabled }) {
    const [selected, setSelected] = useState([]);
    const [hoveredMuscle, setHoveredMuscle] = useState(null);

    const muscleData = {
        'ombros': {
            name: 'Ombros',
            icon: <GiShoulderArmor />,
            color: 'var(--primary)',
            colorDark: 'rgba(36,108,229,0.8)',
            description: 'Deltoides'
        },
        'peito': {
            name: 'Peito',
            icon: <GiMuscleUp />,
            color: 'var(--accent)',
            colorDark: 'rgba(255,145,0,0.8)',
            description: 'Peitoral'
        },
        'biceps': {
            name: 'Bíceps',
            icon: <GiBiceps />,
            color: 'var(--secondary)',
            colorDark: 'rgba(0,200,83,0.8)',
            description: 'Braço Frontal'
        },
        'triceps': {
            name: 'Tríceps',
            icon: <FaDumbbell />,
            color: 'var(--accent)',
            colorDark: 'rgba(255,145,0,0.8)',
            description: 'Braço Traseiro'
        },
        'costas': {
            name: 'Costas',
            icon: <IoBodySharp />,
            color: 'var(--primary)',
            colorDark: 'rgba(36,108,229,0.8)',
            description: 'Dorsais'
        },
        'pernas': {
            name: 'Pernas',
            icon: <GiLeg />,
            color: 'var(--secondary)',
            colorDark: 'rgba(0,200,83,0.8)',
            description: 'Membros Inferiores'
        }
    };

    const toggleMuscle = (muscleId) => {
        if (isDisabled) return;
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
        <div className={`body-selector-epic ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}>

            <div className="muscles-container">
                {Object.entries(muscleData).map(([id, data]) => (
                    <div
                        key={id}
                        className={`muscle-card-epic ${isMuscleSelected(id) ? 'selected' : ''} ${hoveredMuscle === id ? 'hovered' : ''}`}
                        onClick={() => toggleMuscle(id)}
                        onMouseEnter={() => !isDisabled && setHoveredMuscle(id)}
                        onMouseLeave={() => !isDisabled && setHoveredMuscle(null)}
                        style={{
                            '--muscle-color': data.color,
                            '--muscle-color-dark': data.colorDark
                        }}
                    >
                        {/* Badge de selecionado */}
                        {isMuscleSelected(id) && (
                            <div className="selected-indicator">
                                <span className="indicator-check">✓</span>
                            </div>
                        )}

                        {/* Ícone grande */}
                        <div className="muscle-icon" aria-hidden="true">{data.icon}</div>

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
            {!isDisabled && selected.length > 0 && (
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
                                    <span className="pill-icon" aria-hidden="true">{data.icon}</span>
                                    <span className="pill-name">{data.name}</span>
                                    <span className="pill-remove">×</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Mensagem motivacional */}
            {!isDisabled && selected.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🏋️</div>
                    <p className="empty-text">Começa a selecionar os músculos que queres trabalhar!</p>
                </div>
            )}
        </div>
    );
}

export default BodySelector;
