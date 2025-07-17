

import React from 'react';

// Implemented and used
export const LengthIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V16.5M3 7.5V16.5M7.5 3H16.5M7.5 21H16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V21M7.5 12H16.5" />
    </svg>
);

export const MassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const TempIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 00-9-9V7.5a9 9 0 0118 0V12a9 9 0 00-9 9z" />
    </svg>
);

export const DataIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V7.5a3 3 0 013-3h13.5a3 3 0 013 3v3.75a3 3 0 01-3 3m-13.5 0h13.5" />
    </svg>
);

export const TimeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 110-20 10 10 0 010 20z" />
    </svg>
);

export const AreaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M8 3v18" />
    </svg>
);

export const VolumeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5v12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-12a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5z" />
       <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12h3" />
    </svg>
);

export const SpeedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.539.166l-1.853 1.05c-.39.222-.641.662-.641 1.149v1.444c0 .389.223.75.58.908l.25.126a11.162 11.162 0 015.132 1.352 9.75 9.75 0 01-10.264 0l.25-.126a1.125 1.125 0 00.58-.908v-1.444c0-.487-.251-.927-.641-1.149l-1.853-1.05a1.107 1.107 0 00-.539-.166l-.143-.048a2.25 2.25 0 01-1.161-.886l-.51-.766c-.319-.48-.226-1.121.216-1.49l1.068-.89a1.125 1.125 0 00.405-.864v-.568c0-.621.504-1.125 1.125-1.125h9c.621 0 1.125.504 1.125 1.125z" />
    </svg>
);

export const BaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 14.25L21 3.75m0 0h-6.375M21 3.75v6.375" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 14.25 3.75 18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 6.75h.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 8.25h2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.25h.75" />
    </svg>
);

export const AngleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 12l6-6m-6 6l6 6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18" />
    </svg>
);

export const PressureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-3-3h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h.01M18 12h-.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-3.314-2.686-6-6-6h-3c-3.314 0-6 2.686-6 6s2.686 6 6 6h3c3.314 0 6-2.686 6-6z" />
    </svg>
);

export const EnergyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

export const PowerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-2.25 3h5.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21a9 9 0 006-13.875M9 21V3.375M9 21h6.375" />
    </svg>
);

export const CurrencyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-6h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6" />
    </svg>
);

export const LogicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3.75H12M15.75 3.75H12M12 3.75V7.5M12 7.5H8.25m3.75 0H15.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V20.25m0-3.75h-3.75m3.75 0h3.75M12 16.5L9.75 12m2.25 4.5L14.25 12M9.75 12h4.5" />
    </svg>
);

export const DensityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a3 3 0 01-3 3H9a3 3 0 01-3-3V3m0 0l6 6m-6 0h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15h18" />
    </svg>
);

export const FrequencyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25l4.5 7.5L12 4.5l4.5 11.25L21 8.25" />
    </svg>
);

export const SoundIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

export const FuelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
    </svg>
);

export const IlluminanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

export const RadioactivityIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v1.5m6.06-5.06l-1.06 1.06M7.001 6.75l-1.06-1.06M12 19.5A7.5 7.5 0 014.5 12H3m9 7.5a7.5 7.5 0 007.5-7.5h-1.5m-6 0A7.5 7.5 0 0112 4.5V3" />
    </svg>
);

export const MagnetismIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v5.25M9 15H4.5M9 15l-5.25 5.25M15 9V4.5M15 9h5.25M15 9l5.25-5.25M15 15v5.25M15 15h5.25M15 15l5.25 5.25" />
    </svg>
);

export const ForceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 15l-5.25-5.25M8.25 8.25L12 12m2.25-2.25L18 13.5M15 12l-3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
    </svg>
);

export const FlowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75V20.25" />
    </svg>
);

export const CurrentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25h-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25V4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

export const ChargeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5v4.5H3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75l-4.5 4.5 4.5 4.5-4.5 4.5" />
    </svg>
);

export const VoltageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15.5l4.5-8 4.5 8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18h12" />
    </svg>
);

export const ResistanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h1.5l1.5-3 3 6 3-6 1.5 3h1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12h1.5" />
    </svg>
);

export const SubstanceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25a2.25 2.25 0 01-2.25-2.25v-1.5a2.25 2.25 0 012.25-2.25h13.5a2.25 2.25 0 012.25 2.25v1.5a2.25 2.25 0 01-2.25 2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 14.25v3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12" />
    </svg>
);

export const LuminousIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.393l-4.13-4.13a1.5 1.5 0 010-2.121l4.13-4.13a1.5 1.5 0 012.121 0l4.13 4.13a1.5 1.5 0 010 2.121l-4.13 4.13a1.5 1.5 0 01-2.121 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m5.657-15.657l-1.414 1.414M7.757 16.243l-1.414 1.414m11.314 0l-1.414-1.414M7.757 7.757l-1.414-1.414" />
    </svg>
);

export const FractionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
);

export const BmiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v5.25m-4.5-5.25v5.25m9-5.25v5.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 11.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

export const BmrIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 8.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12a4.5 4.5 0 0 1 4.5-4.5H12a4.5 4.5 0 0 1 4.5 4.5v5.25a.75.75 0 0 1-1.5 0v-5.25a3 3 0 0 0-3-3H12a3 3 0 0 0-3 3v5.25a.75.75 0 0 1-1.5 0V12Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm3 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm1.5.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5a1.5 1.5 0 0 0-1.5 1.5v.75a.75.75 0 0 1-1.5 0v-.75a3 3 0 0 1 3-3h.001c1.657 0 3 1.343 3 3v.75a.75.75 0 0 1-1.5 0v-.75a1.5 1.5 0 0 0-1.5-1.5h-.001Z" />
    </svg>
);
