import React from 'react';

const MAX_DIMS = 8;
const MIN_DIMS = 1;

interface MatrixInputProps {
    matrix: string[][];
    setMatrix: (matrix: string[][]) => void;
    isActive: boolean;
    name: string;
    onActivate: () => void;
}

const MatrixInput: React.FC<MatrixInputProps> = ({ matrix, setMatrix, isActive, name, onActivate }) => {
    const rows = matrix.length;
    const cols = matrix[0]?.length || 1;

    const handleCellChange = (r: number, c: number, value: string) => {
        const newMatrix = matrix.map(row => [...row]);
        newMatrix[r][c] = value;
        setMatrix(newMatrix);
    };

    const handleDimChange = (dim: 'rows' | 'cols', delta: 1 | -1) => {
        let newRows = rows;
        let newCols = cols;
        if (dim === 'rows') newRows += delta;
        else newCols += delta;

        if (newRows < MIN_DIMS || newRows > MAX_DIMS || newCols < MIN_DIMS || newCols > MAX_DIMS) return;

        const newMatrix = Array.from({ length: newRows }, (_, r) =>
            Array.from({ length: newCols }, (_, c) => matrix[r]?.[c] || '0')
        );
        setMatrix(newMatrix);
    };

    const activeClasses = isActive ? 'ring-2 ring-primary bg-primary/5' : 'bg-base-200';

    return (
        <div className={`p-3 rounded-lg transition-all duration-200 ${activeClasses}`} onClick={onActivate}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-2 mb-3">
                <h3 className="font-bold text-lg text-base-content w-full text-center">Matrix {name}</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-3 gap-y-1">
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold whitespace-nowrap">Rows: {rows}</span>
                        <button onClick={() => handleDimChange('rows', -1)} className="font-bold w-6 h-6 rounded bg-base-300 hover:bg-base-100">-</button>
                        <button onClick={() => handleDimChange('rows', 1)} className="font-bold w-6 h-6 rounded bg-base-300 hover:bg-base-100">+</button>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold whitespace-nowrap">Cols: {cols}</span>
                        <button onClick={() => handleDimChange('cols', -1)} className="font-bold w-6 h-6 rounded bg-base-300 hover:bg-base-100">-</button>
                        <button onClick={() => handleDimChange('cols', 1)} className="font-bold w-6 h-6 rounded bg-base-300 hover:bg-base-100">+</button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, minmax(40px, 1fr))` }}>
                    {matrix.map((row, r) =>
                        row.map((cell, c) => (
                            <input
                                key={`${r}-${c}`}
                                type="text"
                                value={cell}
                                onChange={(e) => handleCellChange(r, c, e.target.value)}
                                className="w-full h-10 bg-base-100 rounded text-center font-mono text-base-content focus:outline-none focus:ring-2 focus:ring-primary"
                                onFocus={(e) => { onActivate(); e.target.select(); }}
                                data-keyboard-aware="true"
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatrixInput;