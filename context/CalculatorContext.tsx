
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { math as mathjs } from '../lib/mathInstance';
import type { Complex, Unit } from 'mathjs';
import { HistoryEntry, AngleMode, NumberFormat, CalculatorMode } from '../types';
import { useCoreAppContext } from '../hooks/useCoreAppContext';

// Input validation helpers
const isOperator = (char: string): boolean => ['+', '−', '×', '÷', '^'].includes(char);
const isConstant = (char: string): boolean => ['π', 'e'].includes(char);
const isDigit = (char: string): boolean => /[0-9]/.test(char);

interface CalculatorContextType {
  expression: string;
  setExpression: React.Dispatch<React.SetStateAction<string>>;
  cursorPosition: number;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
  isResult: boolean;
  setIsResult: React.Dispatch<React.SetStateAction<boolean>>;
  history: HistoryEntry[];
  memory: number;
  angleMode: AngleMode;
  setAngleMode: (mode: AngleMode) => void;
  numberFormat: NumberFormat;
  setNumberFormat: (format: NumberFormat) => void;
  fixPrecision: number;
  setFixPrecision: (precision: number) => void;
  autoPrecision: number;
  setAutoPrecision: (precision: number) => void;
  isDigitMode: boolean;
  setIsDigitMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleButtonClick: (value: string) => void;
  clearHistory: () => void;
  loadFromHistory: (expression: string) => void;
  inputError: boolean;
  lastResult: number | Complex | string | null;
}

export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

type MathScope = Record<string, (val: number | Complex) => number | Complex | Unit>;

export const CalculatorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { closeHistory, mode } = useCoreAppContext();
  
  const [expression, setExpression] = useState<string>('');
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<AngleMode>(AngleMode.Rad);
  const [numberFormat, setNumberFormatState] = useState<NumberFormat>('fix');
  const [fixPrecision, setFixPrecisionState] = useState<number>(4);
  const [autoPrecision, setAutoPrecisionState] = useState<number>(14);
  const [isDigitMode, setIsDigitMode] = useState(false);
  const [isResult, setIsResult] = useState<boolean>(false);
  const [inputError, setInputError] = useState(false);
  const [lastResult, setLastResult] = useState<number | Complex | string | null>(null);
  const [lastOperation, setLastOperation] = useState<{ operator: string; operand: string } | null>(null);


  // Load state from localStorage on initial mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedMemory = localStorage.getItem('calculator-memory');
    if (savedMemory) setMemory(JSON.parse(savedMemory));
      
    const savedAngleMode = localStorage.getItem('calculator-angle-mode') as AngleMode | null;
    if (savedAngleMode) setAngleMode(savedAngleMode);
      
    const savedFormat = localStorage.getItem('calculator-number-format') as NumberFormat | null;
    if (savedFormat) setNumberFormatState(savedFormat);

    const savedPrecision = localStorage.getItem('calculator-fix-precision');
    if (savedPrecision) setFixPrecisionState(parseInt(savedPrecision, 10));
      
    const savedAutoPrecision = localStorage.getItem('calculator-auto-precision');
    if (savedAutoPrecision) setAutoPrecisionState(parseInt(savedAutoPrecision, 10));
  }, []);

  // Persist state to localStorage
  useEffect(() => {
     localStorage.setItem('calculator-history', JSON.stringify(history));
  }, [history]);
  
  useEffect(() => {
     localStorage.setItem('calculator-memory', JSON.stringify(memory));
  }, [memory]);

  useEffect(() => {
     localStorage.setItem('calculator-angle-mode', angleMode);
  }, [angleMode]);

  const setNumberFormat = (format: NumberFormat) => {
    setNumberFormatState(format);
    localStorage.setItem('calculator-number-format', format);
  };
    
  const setFixPrecision = (precision: number) => {
    const p = Math.max(0, Math.min(40, precision || 0));
    setFixPrecisionState(p);
    localStorage.setItem('calculator-fix-precision', String(p));
  };
    
  const setAutoPrecision = (precision: number) => {
    const p = Math.max(1, Math.min(40, precision || 1));
    setAutoPrecisionState(p);
    localStorage.setItem('calculator-auto-precision', String(p));
  };


  const clearHistory = () => {
    setHistory([]);
  };
  
  const loadFromHistory = (expr: string) => {
    setExpression(expr);
    setCursorPosition(expr.length);
    setIsResult(false);
    setLastResult(null);
    closeHistory();
  };
    
  const evaluateExpression = useCallback((exp: string): string | number | Complex | null => {
    if (exp.trim() === '') return null;

    const preprocessAbs = (str: string): string => {
        let newExpr = '';
        let open = false;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '|') {
                newExpr += open ? ')' : 'abs(';
                open = !open;
            } else {
                newExpr += str[i];
            }
        }
        if (open) {
            throw new Error("Unmatched absolute value bars '|'");
        }
        return newExpr;
    };

    try {
      const sanitizedExpression = exp.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/√/g, 'sqrt').replace(/π/g, '(pi)');
      let processedAbs = preprocessAbs(sanitizedExpression);
      
      // Custom log_base(arg) parser
      const customLogRegex = /log((?:\d*\.?\d+)|e|\(pi\))\(([^)]*)\)/g;
      const processedLog = processedAbs.replace(customLogRegex, (match, base, arg) => {
          return `log(${arg}, ${base})`;
      });

      const expandMatch = processedLog.match(/^expand\((.*)\)$/i);
      if (expandMatch && expandMatch[1]) {
          try {
              return (mathjs as any).expand(expandMatch[1]).toString();
          } catch (e) {
              throw new Error(`Error in expand(): ${(e as Error).message}`);
          }
      }

      const factorMatch = processedLog.match(/^factor\((.*)\)$/i);
      if (factorMatch && factorMatch[1]) {
          try {
              return (mathjs as any).factor(factorMatch[1]).toString();
          } catch (e) {
              throw new Error('factor() can only be applied to polynomials.');
          }
      }

      const scope: MathScope = {};
      if (angleMode !== AngleMode.Rad) {
        const converter = (x: number | Complex): Unit | Complex => {
            if (typeof x === 'number') {
                return angleMode === AngleMode.Deg
                    ? mathjs.unit(x, 'deg')
                    : mathjs.unit(x, 'grad');
            }
            return x; // return complex as-is
        }
        
        const fromRadians = (rad: number | Complex): number | Complex => {
            if (typeof rad === 'number') {
                if (angleMode === AngleMode.Deg) {
                    return (rad * 180) / Math.PI;
                } else { // AngleMode.Grad
                    return (rad * 200) / Math.PI;
                }
            }
            return rad; // return complex as-is
        };

        scope.sin = (x) => { const converted = converter(x); return mathjs.isComplex(converted) ? mathjs.sin(converted) : mathjs.sin(converted as Unit); };
        scope.cos = (x) => { const converted = converter(x); return mathjs.isComplex(converted) ? mathjs.cos(converted) : mathjs.cos(converted as Unit); };
        scope.tan = (x) => { const converted = converter(x); return mathjs.isComplex(converted) ? mathjs.tan(converted) : mathjs.tan(converted as Unit); };
        scope.asin = (x) => fromRadians(mathjs.isComplex(x) ? mathjs.asin(x) : mathjs.asin(x as number));
        scope.acos = (x) => fromRadians(mathjs.isComplex(x) ? mathjs.acos(x) : mathjs.acos(x as number));
        scope.atan = (x) => fromRadians(mathjs.isComplex(x) ? mathjs.atan(x) : mathjs.atan(x as number));
      }
      
      try {
        // First, try to evaluate numerically
        let result: any = mathjs.evaluate(processedLog, scope);
        if (mathjs.isBigNumber(result)) result = result.toNumber();
        if (mathjs.isComplex(result)) return result;
        
        if (typeof result === 'number') {
            if (!isFinite(result)) {
                // This case might be for symbolic expressions that evaluate to a non-finite form,
                // so we'll let the symbolic evaluation catch block handle it.
                throw new Error("Result is not a finite number.");
            }
        } else {
            // Not a number, not complex. Could be a matrix, unit, or string from symbolic eval.
            // Throw to enter symbolic evaluation path.
            throw new Error("Result is not a finite number.");
        }
        return result;

      } catch (numericError: any) {
        // Numeric evaluation failed. This could be due to undefined symbols (symbolic math)
        // or a syntax error. We'll try to treat it as a symbolic expression.
        try {
            // `expand` is great for polynomials like (x+1)^2 or (z^2+1)^2
            return (mathjs as any).expand(processedLog).toString();
        } catch (expandError) {
            // If expand fails, it might not be a standard polynomial.
            // `simplify` is more general and can handle things like x+x -> 2x
            try {
                return mathjs.simplify(processedLog).toString();
            } catch (simplifyError) {
                // If both symbolic operations fail, it's likely a genuine syntax error.
                // Throw the original error from the numeric evaluation attempt as it's more descriptive.
                throw numericError;
            }
        }
      }

    } catch (error: any) {
        console.error("Evaluation Error:", error);
        throw error;
    }
  }, [angleMode]);

   const insertText = (text: string) => {
        if (isResult) {
            setExpression('');
            setIsResult(false);
            setLastResult(null);
        }
        if (expression === 'Error') {
            setExpression(text);
            setCursorPosition(text.length);
            return;
        }
        const newExpression = expression.slice(0, cursorPosition) + text + expression.slice(cursorPosition);
        setExpression(newExpression);
        setCursorPosition(cursorPosition + text.length);
        setIsResult(false);
        setLastResult(null);
    }
  
  const flashInputError = useCallback(() => {
    setInputError(true);
    setTimeout(() => setInputError(false), 500);
  }, []);

  const handleButtonClick = useCallback((value: string) => {
    if (value !== '=') {
        setLastOperation(null);
    }
    
    if (isOperator(value)) {
        const textBeforeCursor = expression.slice(0, cursorPosition).trim();
        const lastChar = textBeforeCursor.slice(-1);

        // Rule: Prevent starting with an operator other than `-`
        if (textBeforeCursor === '' && value !== '−') {
            flashInputError();
            return;
        }

        // Rule: Prevent operator directly after an open parenthesis, except for `-`
        if (lastChar === '(' && value !== '−') {
            flashInputError();
            return;
        }

        // Rule: Handle consecutive operators
        if (isOperator(lastChar)) {
            // A) Prevent sequences like `++`, `**`, `+*` by disallowing any non-minus operator
            if (value !== '−') {
                flashInputError();
                return;
            }
            // B) Prevent a third operator in a row, e.g. `5*--` or `---`
            const charBeforeLast = textBeforeCursor.slice(-2, -1);
            if (isOperator(charBeforeLast)) {
                flashInputError();
                return;
            }
        }
    }


    if (isResult && !['DEL', 'AC', '=', '+', '−', '×', '÷', '%', '^', '+/-', 'F↔D', 'M+', 'M-', 'MR', 'MC', 'Rect↔Polar', '|'].includes(value)) {
      setExpression('');
      setCursorPosition(0);
      setIsResult(false);
      setLastResult(null);
    }

    const insertFunctionCall = (funcWithParen: string) => {
        insertText(funcWithParen);
    };
      
    switch (value) {
      case 'AC':
        setExpression(''); setCursorPosition(0); setIsResult(false); setLastResult(null); break;
      case 'DEL':
        if (cursorPosition > 0 && expression !== 'Error') {
          const newExpression = expression.slice(0, cursorPosition - 1) + expression.slice(cursorPosition);
          setExpression(newExpression); setCursorPosition(prev => prev - 1);
        }
        setIsResult(false); setLastResult(null); break;
      case '=': {
        const processAndSetResult = (expr: string) => {
            try {
                const result = evaluateExpression(expr);
                if (result !== null) {
                  setLastResult(result);
                  let resultStr: string;
        
                  if (typeof result === 'string') {
                      resultStr = result
                          .replace(/ \+ /g, '+')
                          .replace(/ - /g, '-')
                          .replace(/ \/ /g, '/')
                          .replace(/ \^ /g, '^')
                          .replace(/ \* /g, '')
                          .replace(/\( /g, '(')
                          .replace(/ \)/g, ')');
                  } else if (mathjs.isComplex(result)) {
                      resultStr = mathjs.format(result, { precision: 12 });
                  } else if (typeof result === 'number') { 
                    const numResult = result;
                    if (mode === CalculatorMode.Scientific) {
                      let resultStrValue: string;
                      const formatOptions: any = {};
                  
                      if (numberFormat === 'fix') {
                          const precisionThreshold = Math.pow(10, -fixPrecision);
                          const largeNumberThreshold = 1e12; // For large numbers
                          if ((Math.abs(numResult) > 0 && Math.abs(numResult) < precisionThreshold) || Math.abs(numResult) >= largeNumberThreshold) {
                              // Fallback to scientific notation for very small or large numbers
                              formatOptions.notation = 'exponential';
                              // Use fixPrecision as the number of significant digits, with a minimum of 1
                              formatOptions.precision = Math.max(1, fixPrecision);
                              resultStrValue = mathjs.format(numResult, formatOptions);
                          } else {
                              formatOptions.notation = 'fixed';
                              formatOptions.precision = fixPrecision;
                              const formatted = mathjs.format(numResult, formatOptions);
                              resultStrValue = String(parseFloat(formatted));
                          }
                      } else { // 'auto', 'sci', 'eng'
                          switch (numberFormat) {
                              case 'sci': formatOptions.notation = 'exponential'; break;
                              case 'eng': formatOptions.notation = 'engineering'; break;
                              default: 
                                formatOptions.notation = 'auto';
                                formatOptions.lowerExp = -9;
                                formatOptions.upperExp = 12;
                                break;
                          }
                          formatOptions.precision = autoPrecision;
                          resultStrValue = mathjs.format(numResult, formatOptions);
                      }
                      resultStr = resultStrValue;
                    } else if (mode === CalculatorMode.Basic) {
                        resultStr = String(Number(numResult.toPrecision(3)));
                    } else { // For Complex, and other modes
                        if (Math.abs(numResult) > 1e16 || (Math.abs(numResult) < 1e-16 && numResult !== 0)) {
                            resultStr = numResult.toExponential(14);
                        } else {
                            resultStr = mathjs.format(numResult, { precision: 16 });
                        }
                    }
                  } else {
                    resultStr = String(result);
                  }
        
                  setHistory(prev => [{ id: new Date().toISOString(), expression: expr, result: resultStr }, ...prev].slice(0, 100));
                  setExpression(resultStr); setCursorPosition(resultStr.length); setIsResult(true);
                } else if (expression.trim() !== '') {
                  setExpression('Error'); setCursorPosition(5); setIsResult(true); setLastResult(null);
                  flashInputError();
                }
            } catch (e: any) {
                setExpression(e.message || 'Error');
                setCursorPosition((e.message || 'Error').length);
                setIsResult(true);
                setLastResult(null);
                flashInputError();
            }
        };

        if (isResult && lastOperation) {
            const currentResultValue = lastResult !== null ? mathjs.format(lastResult, { precision: 16 }) : expression;
            const repeatExpression = currentResultValue + lastOperation.operator + lastOperation.operand;
            processAndSetResult(repeatExpression);
            return;
        }

        const open = (expression.match(/\(/g) || []).length;
        const closed = (expression.match(/\)/g) || []).length;
        const absBars = (expression.match(/\|/g) || []).length;
        if (open !== closed) {
            setExpression('Error: Brackets'); flashInputError(); setIsResult(true); return;
        }
        if (absBars % 2 !== 0) {
            setExpression('Error: Bars'); flashInputError(); setIsResult(true); return;
        }

        let exprToEval = expression;
        if (isOperator(exprToEval.slice(-1))) exprToEval = exprToEval.slice(0, -1);
        
        // Find and store the last operation before evaluating.
        let lastOpIndex = -1;
        for (let i = exprToEval.length - 1; i >= 0; i--) {
            const char = exprToEval[i];
            if (isOperator(char)) {
                if ((char === '+' || char === '−') && i > 0 && exprToEval[i - 1].toLowerCase() === 'e') continue;
                if ((char === '+' || char === '−') && i > 0 && exprToEval[i - 1] === '(') continue;
                if (i === 0) continue; // Unary operator at the start
                lastOpIndex = i;
                break;
            }
        }
    
        if (lastOpIndex > 0 && lastOpIndex < exprToEval.length - 1) {
            const operator = exprToEval[lastOpIndex];
            const operand = exprToEval.substring(lastOpIndex + 1);
            if (operand.trim()) {
                setLastOperation({ operator, operand });
            } else {
                setLastOperation(null);
            }
        } else {
            setLastOperation(null);
        }

        processAndSetResult(exprToEval);
        break;
      }
      case 'i':
        insertText(value);
        break;
      case 'Rect↔Polar': {
        if (isResult && lastResult && mathjs.isComplex(lastResult)) {
            const currentIsPolar = expression.includes('exp(');
            let newExpression;
            if (currentIsPolar) {
                newExpression = mathjs.format(lastResult, { precision: 12 });
            } else {
                const polar = lastResult.toPolar();
                newExpression = `${mathjs.format(polar.r, {precision: 12})} * exp(i * ${mathjs.format(polar.phi, {precision: 12})})`;
            }
            setExpression(newExpression);
            setCursorPosition(newExpression.length);
        } else {
            flashInputError();
        }
        break;
      }
      case '1/x': insertText('1/('); break;
      case 'π': case 'e': case 'x':
        insertText(value);
        break;
      case '+/-': {
         if (isResult) {
            setLastResult(null);
            if (expression.startsWith('-')) {
                const newExpr = expression.substring(1);
                 setExpression(newExpr); setCursorPosition(newExpr.length);
            } else if (expression !== '0') {
                 const newExpr = `-${expression}`;
                 setExpression(newExpr); setCursorPosition(newExpr.length);
            }
        } else { insertText('-'); }
        setIsResult(false); break;
      }
      case 'x^2': insertText('^2'); break;
      case 'x^3': insertText('^3'); break;
      case '!': insertText('!'); break;
      case '|': insertText('|'); break;
      case 'F↔D': {
        try {
            const originalExpression = expression.trim();
            if (originalExpression === '' || originalExpression.toLowerCase().includes('error')) {
                flashInputError();
                break;
            }
            
            const sanitized = originalExpression.replace(/,/g, '.');
            const stdFractionMatch = sanitized.match(/^(-?)(\d+)\/([1-9]\d*)$/);
            
            let newExpression: string | undefined;

            if (stdFractionMatch) { // It's already a simple fraction, convert to decimal
                const evaluated = mathjs.evaluate(sanitized);
                newExpression = mathjs.format(evaluated, { notation: 'auto', precision: 14 });
            } else { // It's a decimal or a complex expression, try to convert to a fraction
                try {
                    const evaluated = mathjs.evaluate(sanitized);
                    
                    if (mathjs.isComplex(evaluated) || mathjs.isUnit(evaluated)) {
                        flashInputError();
                        break;
                    }

                    let numForFraction: number;
                    numForFraction = mathjs.number(evaluated); // Handles number, BigNumber, etc.
                    
                    if (!isFinite(numForFraction)) {
                         throw new Error("Result is not a finite number.");
                    }

                    const frac = mathjs.fraction(numForFraction);
                    newExpression = `${frac.s === -1 ? '-' : ''}${frac.n}/${frac.d}`;

                } catch (e) {
                    // This can happen if the number cannot be represented as a simple fraction
                    // (e.g. from sqrt(2)) or if evaluation fails.
                    flashInputError();
                }
            }

            if (newExpression && newExpression !== expression) {
                setExpression(newExpression);
                setCursorPosition(newExpression.length);
                setIsResult(true);
            } else {
                flashInputError();
            }

        } catch (e) { 
            flashInputError(); 
        }
        break;
      }
      // Group all function-like button presses here for consistent handling
      case 'permutations(': case 'combinations(':
      case 'sqrt(': case 'cbrt(': case 'nthRoot(':
      case 'sin(': case 'cos(': case 'tan(': case 'asin(': case 'acos(': case 'atan(':
      case 'sinh(': case 'cosh(': case 'tanh(': case 'asinh(': case 'acosh(': case 'atanh(':
      case 'log10(': case 'exp(':
      case 're(': case 'im(': case 'arg(': case 'abs(': case 'conj(':
      case 'expand(': case 'factor(':
      case '(': case 'log': // `log` is now handled here to allow `log<base>(arg)`
        insertFunctionCall(value);
        break;

      case ')': {
        const textBeforeCursor = expression.slice(0, cursorPosition).trim();
        const lastChar = textBeforeCursor.slice(-1);
        const open = (expression.match(/\(/g) || []).length;
        const closed = (expression.match(/\)/g) || []).length;
        if (open <= closed || isOperator(lastChar) || lastChar === '(') {
            flashInputError();
        } else {
            insertText(')');
        }
        break;
      }
      
      case '10^': insertText('10^'); break;
      case 'MC': setMemory(0); break;
      case 'MR': insertText(String(memory)); break;
      case 'M+': case 'M-': {
        const currentValResult = evaluateExpression(expression);
        let numericValue: number | null = null;
  
        if (typeof currentValResult === 'number') {
            numericValue = currentValResult;
        } else if (mathjs.isComplex(currentValResult)) {
            numericValue = currentValResult.re;
        }
  
        if (numericValue !== null && isFinite(numericValue)) {
            setMemory(prev => value === 'M+' ? prev + numericValue : prev - numericValue);
            setIsResult(true);
        } else {
           // Fallback to history if current expression is not a finite number
           const lastResultVal = history.length > 0 ? parseFloat(history[0].result) : NaN;
           if (!isNaN(lastResultVal)) {
               setMemory(prev => (value === 'M+' ? prev + lastResultVal : prev - lastResultVal));
               setIsResult(true); // Also set result state here
           } else {
               flashInputError();
           }
        }
        break;
      }
      default:
        // Handles operators and digits
        if (isResult) {
            const isOperatorVal = isOperator(value);
            if (isOperatorVal) {
                // Use full precision `lastResult` for chained calculations
                let startOfExpr;
                if (lastResult !== null) {
                    if (typeof lastResult === 'object' && 're' in lastResult) { // isComplex
                        startOfExpr = mathjs.format(lastResult, { precision: 16 });
                    } else { // number, string
                        startOfExpr = mathjs.format(lastResult, { precision: 16 });
                    }
                } else {
                    startOfExpr = expression; // Fallback
                }
                const newExpr = startOfExpr + value;
                setExpression(newExpr);
                setCursorPosition(newExpr.length);
                setIsResult(false);
            } else {
                // This is for starting a new calculation by typing a digit.
                setExpression(value);
                setCursorPosition(value.length);
                setIsResult(false);
                setLastResult(null);
            }
        } else {
            insertText(value);
        }
        break;
    }
  }, [expression, isResult, memory, history, cursorPosition, flashInputError, angleMode, numberFormat, fixPrecision, autoPrecision, evaluateExpression, lastResult, mode, lastOperation]);

  const contextValue = {
    expression, setExpression, cursorPosition, setCursorPosition, isResult, setIsResult,
    history, memory, angleMode, setAngleMode, 
    numberFormat, setNumberFormat, fixPrecision, setFixPrecision,
    autoPrecision, setAutoPrecision,
    isDigitMode, setIsDigitMode,
    handleButtonClick, clearHistory, loadFromHistory, inputError,
    lastResult,
  };

  return <CalculatorContext.Provider value={contextValue}>{children}</CalculatorContext.Provider>;
};
