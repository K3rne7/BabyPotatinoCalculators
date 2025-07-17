import React from 'react';
import Button from '../ui/Button';

interface ConverterKeypadProps {
  onKeyPress: (value: string) => void;
}

const keypadLayout = [
  '7', '8', '9', 'DEL',
  '4', '5', '6', 'AC',
  '1', '2', '3', '.',
];

const ariaLabels: { [key: string]: string } = {
  'DEL': 'Delete',
  'AC': 'All Clear',
  '.': 'Decimal Point'
};

const ConverterKeypad: React.FC<ConverterKeypadProps> = ({ onKeyPress }) => {
  const getButtonClass = (btn: string) => {
    if (['DEL', 'AC'].includes(btn)) {
      return 'bg-secondary/80 hover:brightness-115 text-white';
    }
    return 'bg-base-200/60 hover:bg-base-200/90';
  };

  return (
    <div className="w-full grid grid-cols-4 gap-2" role="grid">
      {keypadLayout.map((btn) => (
        <Button
          key={btn}
          onClick={() => onKeyPress(btn)}
          className={`${getButtonClass(btn)} h-14 text-xl md:text-2xl`}
          aria-label={ariaLabels[btn] || btn}
          role="gridcell"
        >
          {btn}
        </Button>
      ))}
      <Button
          onClick={() => onKeyPress('0')}
          className={`${getButtonClass('0')} col-span-4 h-14 text-xl md:text-2xl`}
          role="gridcell"
          aria-label="0"
        >
          0
      </Button>
    </div>
  );
};

export default ConverterKeypad;