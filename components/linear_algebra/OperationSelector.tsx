import React from 'react';
import CustomSelect from '../ui/CustomSelect';

interface OperationSelectorProps {
    operation: string;
    onOperationChange: (op: string) => void;
    onCalculate: () => void;
    vectorB: string;
    setVectorB: (vec: string) => void;
    exponentK: string;
    setExponentK: (k: string) => void;
}

const operations = [
    { label: "Basic Operations", isHeader: true, value: "h_basic" },
    { value: "ADD", label: "A + B" },
    { value: "SUB", label: "A - B" },
    { value: "MUL", label: "A × B" },
    { label: "Matrix Properties", isHeader: true, value: "h_props" },
    { value: "DET_A", label: "Determinant (det A)" },
    { value: "RANK_A", label: "Rank (A)" },
    { value: "TRACE_A", label: "Trace (A)" },
    { value: "NORM_A", label: "Norm (A)" },
    { value: "COND_A", label: "Condition Number (cond A)" },
    { label: "Forms & Solvers", isHeader: true, value: "h_forms" },
    { value: "INV_A", label: "Inverse (A⁻¹)" },
    { value: "TRANS_A", label: "Transpose (Aᵀ)" },
    { value: "RREF_A", label: "Reduced Row Echelon Form (rref A)" },
    { value: "PSEUDO_INV_A", label: "Pseudoinverse (A⁺)" },
    { value: "SOLVE_AX_B", label: "Solve Ax = b" },
    { label: "Decompositions", isHeader: true, value: "h_decomp" },
    { value: "LU_A", label: "LU Decomposition" },
    { value: "QR_A", label: "QR Decomposition" },
    { value: "SVD_A", label: "SVD" },
    { value: "EIGS_A", label: "Eigenvalues & Eigenvectors" },
    { label: "Advanced", isHeader: true, value: "h_adv" },
    { value: "POW_A_K", label: "Power (Aᵏ)" },
    { value: "EXPM_A", label: "Matrix Exponential (eᴬ)" },
];

const OperationSelector: React.FC<OperationSelectorProps> = ({
    operation,
    onOperationChange,
    onCalculate,
    vectorB,
    setVectorB,
    exponentK,
    setExponentK
}) => {
    
    const needsVectorB = operation === 'SOLVE_AX_B';
    const needsExponentK = operation === 'POW_A_K';

    return (
        <div className="flex flex-col gap-3 p-3 bg-base-300 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="w-full sm:flex-grow">
                    <CustomSelect 
                        value={operation}
                        onChange={onOperationChange}
                        options={operations}
                        variant="solid"
                    />
                </div>
                <button
                    onClick={onCalculate}
                    className="w-full sm:w-auto px-6 bg-primary text-white rounded-lg hover:bg-primary-focus font-semibold transition-colors"
                >
                    Calculate
                </button>
            </div>
            
            {needsVectorB && (
                <div className="flex flex-col gap-1 animate-fade-in-up">
                    <label htmlFor="vectorB" className="text-sm font-semibold">Vector b (comma-separated)</label>
                    <input 
                        id="vectorB"
                        type="text"
                        value={vectorB}
                        onChange={(e) => setVectorB(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-base-100 rounded p-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., 1, 2+3i, 5"
                        data-keyboard-aware="true"
                    />
                </div>
            )}
            
            {needsExponentK && (
                 <div className="flex flex-col gap-1 animate-fade-in-up">
                    <label htmlFor="exponentK" className="text-sm font-semibold">Exponent k</label>
                    <input 
                        id="exponentK"
                        type="text"
                        value={exponentK}
                        onChange={(e) => setExponentK(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-full bg-base-100 rounded p-2 font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="e.g., 2, -1, 0.5"
                        data-keyboard-aware="true"
                    />
                </div>
            )}
        </div>
    );
};

export default OperationSelector;