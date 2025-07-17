import React, { useState } from 'react';
import ResistorColorCodeCalculator from '../electronics/ResistorColorCodeCalculator';
import OhmsLawCalculator from '../electronics/OhmsLawCalculator';
import CapacitorCodeCalculator from '../electronics/CapacitorCodeCalculator';

type ElectronicsTool = 'resistor' | 'ohms-law' | 'capacitor';

const tools: { id: ElectronicsTool; name: string; component: React.FC, icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { 
        id: 'resistor', 
        name: 'Resistor Code', 
        component: ResistorColorCodeCalculator, 
        icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 0-1.5-3.375-1.5 3.375m19.5 0-1.5-3.375-1.5 3.375" />
                <rect x="7.5" y="9" width="9" height="6" rx="1" stroke="currentColor" fill="transparent" />
            </svg>
        )
    },
    { 
        id: 'ohms-law', 
        name: "Ohm's Law", 
        component: OhmsLawCalculator,
        icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
            </svg>
        )
    },
     { 
        id: 'capacitor', 
        name: "Capacitor Code", 
        component: CapacitorCodeCalculator,
        icon: (props) => (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h3m-3 12h3M3.75 6v12m16.5-12v12" />
             </svg>
        )
    },
];

const ElectronicsCalculator: React.FC = () => {
    const [activeTool, setActiveTool] = useState<ElectronicsTool>('resistor');

    const ActiveComponent = tools.find(t => t.id === activeTool)?.component || ResistorColorCodeCalculator;

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[550px] w-full bg-base-100 rounded-lg shadow-inner overflow-hidden">
            <nav className="flex-shrink-0 bg-base-200 p-2">
                <div className="flex items-center gap-2">
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            onClick={() => setActiveTool(tool.id)}
                            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-semibold transition-colors duration-200
                                ${activeTool === tool.id ? 'bg-primary text-white' : 'bg-base-100 hover:bg-base-300'}
                            `}
                        >
                            <tool.icon className="w-5 h-5" />
                            <span className="hidden sm:inline">{tool.name}</span>
                        </button>
                    ))}
                </div>
            </nav>
            <main className="flex-1 overflow-y-auto p-3 sm:p-4">
                <ActiveComponent />
            </main>
        </div>
    );
};

export default ElectronicsCalculator;