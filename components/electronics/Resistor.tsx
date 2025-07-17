import React from 'react';

interface ResistorProps {
  bandColors: string[];
}

const Resistor: React.FC<ResistorProps> = ({ bandColors }) => {
  const numBands = bandColors.length;
  const isSixBand = numBands === 6;

  // Bands are grouped logically for layout:
  // 4-band: [d1, d2, mult], tol
  // 5-band: [d1, d2, d3, mult], tol
  // 6-band: [d1, d2, d3, mult], tol, tcr
  const digitMultiplierBands = bandColors.slice(0, numBands - (isSixBand ? 2 : 1));
  const toleranceBand = bandColors[numBands - (isSixBand ? 2 : 1)];
  const tcrBand = isSixBand ? bandColors[numBands - 1] : null;

  return (
    <div className="flex items-center justify-center h-24">
      {/* Wire Start */}
      <div className="h-0.5 w-8 bg-gray-400"></div>
      
      {/* Resistor Body */}
      <div className="relative w-48 h-12 bg-[#F5DEB3] dark:bg-[#C2B280] rounded-lg shadow-inner flex items-center justify-center gap-2 px-2">
        {/* Main bands (digits and multiplier) */}
        {digitMultiplierBands.map((color, index) => (
            <div key={`main-${index}`} className="h-full w-2" style={{ backgroundColor: color }}></div>
        ))}
        
        {/* Spacer before tolerance band */}
        <div className="w-4 flex-shrink-0"></div>

        {/* Tolerance band */}
        <div className="h-full w-2" style={{ backgroundColor: toleranceBand }}></div>

        {/* TCR band (for 6-band resistors) */}
        {tcrBand && (
            <>
              <div className="w-1 flex-shrink-0"></div>
              <div className="h-full w-3" style={{ backgroundColor: tcrBand }}></div>
            </>
        )}
      </div>
      
      {/* Wire End */}
      <div className="h-0.5 w-8 bg-gray-400"></div>
    </div>
  );
};

export default Resistor;
