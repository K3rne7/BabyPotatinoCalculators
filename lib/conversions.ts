

import React from 'react';
import { ConversionConfigs, ConversionType } from '../types';
import { 
    LengthIcon, MassIcon, TempIcon, DataIcon, AreaIcon, VolumeIcon, SpeedIcon, TimeIcon,
    AngleIcon, BaseIcon, CurrencyIcon, DensityIcon, EnergyIcon, FlowIcon, ForceIcon,
    FrequencyIcon, FuelIcon, IlluminanceIcon, LogicIcon, MagnetismIcon, PowerIcon,
    PressureIcon, RadioactivityIcon, SoundIcon,
    CurrentIcon, VoltageIcon, ChargeIcon, ResistanceIcon, SubstanceIcon, LuminousIcon,
    FractionsIcon, BmiIcon, BmrIcon
} from '../components/converter/icons';
import BaseConverter from '../components/converter/custom/BaseConverter';
import NotationConverter from '../components/converter/custom/NotationConverter';
import LogicConverter from '../components/converter/custom/LogicConverter';
import CurrencyConverter from '../components/converter/custom/CurrencyConverter';
import BmiCalculator from '../components/converter/custom/BmiCalculator';
import BmrCalculator from '../components/converter/custom/BmrCalculator';

export const conversionFormulas = {
    // Temperature conversion logic
    temperature: (value: number, from: string, to: string): number => {
        if (from === to) return value;
        let celsius: number;
        switch (from) {
            case 'c': celsius = value; break;
            case 'f': celsius = (value - 32) * 5 / 9; break;
            case 'k': celsius = value - 273.15; break;
            case 'r': celsius = (value - 491.67) * 5 / 9; break;
            case 're': celsius = value * 1.25; break;
            default: return NaN;
        }
        switch (to) {
            case 'c': return celsius;
            case 'f': return (celsius * 9 / 5) + 32;
            case 'k': return celsius + 273.15;
            case 'r': return (celsius + 273.15) * 9 / 5;
            case 're': return celsius * 0.8;
            default: return NaN;
        }
    },
    // Fuel consumption conversion logic
    fuel: (value: number, from: string, to: string): number => {
        if (from === to) return value;
        if (value === 0) return 0; // Avoid division by zero
        let kpl: number; // Base unit: Kilometers per Liter
        switch (from) {
            case 'km/l': kpl = value; break;
            case 'l/100km': kpl = 100 / value; break;
            case 'mpg-us': kpl = value * 0.425144; break;
            case 'mpg-uk': kpl = value * 0.354006; break;
            default: return NaN;
        }
        switch (to) {
            case 'km/l': return kpl;
            case 'l/100km': return 100 / kpl;
            case 'mpg-us': return kpl * 2.35214;
            case 'mpg-uk': return kpl * 2.82481;
            default: return NaN;
        }
    },
    // Sound level conversion (logarithmic)
    sound: (value: number, from: string, to: string): number => {
        if (from === to) return value;
        // Base unit is dB
        const Neper_to_dB = 8.685889638;
        let dbValue: number;
        switch(from) {
            case 'db': dbValue = value; break;
            case 'np': dbValue = value * Neper_to_dB; break;
            default: return NaN;
        }
        switch(to) {
            case 'db': return dbValue;
            case 'np': return dbValue / Neper_to_dB; break;
            default: return NaN;
        }
    },
    // Standard conversion logic using factors
    standard: (value: number, fromUnit: { toBase: number }, toUnit: { toBase: number }): number => {
        const valueInBase = value * fromUnit.toBase;
        return valueInBase / toUnit.toBase;
    }
};

const createUnit = (name: string, toBase: number, plural?: string) => ({ name, toBase, plural: plural || `${name}s` });

export const conversionCategories: ConversionConfigs = {
    // ==== COMMON ====
    length: {
        name: 'Length', type: ConversionType.STANDARD, icon: LengthIcon, baseUnit: 'm',
        units: {
            // Scientific & Metric (Small)
            'planck-length': createUnit('Planck Length (ℓₚ)', 1.616255e-35),
            'ym': createUnit('Yoctometer (ym)', 1e-24), 'zm': createUnit('Zeptometer (zm)', 1e-21),
            'am': createUnit('Attometer (am)', 1e-18), 'fm': createUnit('Femtometer (fm)', 1e-15),
            'pm': createUnit('Picometer (pm)', 1e-12), 'angstrom': createUnit('Ångström (Å)', 1e-10),
            'nm': createUnit('Nanometer (nm)', 1e-9), 'μm': createUnit('Micrometer (µm)', 1e-6),
            'mm': createUnit('Millimeter (mm)', 1e-3), 'cm': createUnit('Centimeter (cm)', 1e-2), 'dm': createUnit('Decimeter (dm)', 1e-1),
            'm': createUnit('Meter (m)', 1), 
            'dam': createUnit('Decameter (dam)', 10), 'hm': createUnit('Hectometer (hm)', 100),
            'km': createUnit('Kilometer (km)', 1000), 'Mm': createUnit('Megameter (Mm)', 1e6), 'Gm': createUnit('Gigameter (Gm)', 1e9),
            // Imperial
            'in': createUnit('Inch', 0.0254, 'Inches'), 'ft': createUnit('Foot', 0.3048, 'Feet'),
            'yd': createUnit('Yard', 0.9144), 'nmi': createUnit('Nautical Mile', 1852),
            'mi': createUnit('Mile', 1609.34),
            // Astronomical
            'ls': createUnit('Light-second', 299792458), 'au': createUnit('Astronomical Unit (AU)', 149597870700),
            'lm': createUnit('Light-minute', 17987547480), 'lh': createUnit('Light-hour', 1079252848800),
            'ld': createUnit('Light-day', 25902068371200), 'ly': createUnit('Light-year (ly)', 9.461e15),
            'pc': createUnit('Parsec (pc)', 3.086e16), 'kpc': createUnit('Kiloparsec (kpc)', 3.086e19),
            'mpc': createUnit('Megaparsec (mpc)', 3.086e22), 'gpc': createUnit('Gigaparsec (gpc)', 3.086e25),
            'Tm': createUnit('Terameter (Tm)', 1e12), 'Pm': createUnit('Petameter (Pm)', 1e15), 'Em': createUnit('Exameter (Em)', 1e18),
            'Zm': createUnit('Zettameter (Zm)', 1e21), 'Ym': createUnit('Yottameter (Ym)', 1e24),
        }
    },
    mass: {
        name: 'Mass', type: ConversionType.STANDARD, icon: MassIcon, baseUnit: 'kg',
        units: {
            'planck-mass': createUnit('Planck Mass', 2.176434e-8),
            'Da': createUnit('Dalton (Da)', 1.66054e-27), 'u': createUnit('Atomic Mass Unit (u)', 1.66054e-27),
            'yg': createUnit('Yoctogram (yg)', 1e-27), 'zg': createUnit('Zeptogram (zg)', 1e-24),
            'ag': createUnit('Attogram (ag)', 1e-21), 'fg': createUnit('Femtogram (fg)', 1e-18),
            'pg': createUnit('Picogram (pg)', 1e-15), 'ng': createUnit('Nanogram (ng)', 1e-12),
            'μg': createUnit('Microgram (µg)', 1e-9), 'mg': createUnit('Milligram (mg)', 1e-6),
            'cg': createUnit('Centigram (cg)', 1e-5), 'ct': createUnit('Carat', 2e-4), 'dg': createUnit('Decigram (dg)', 1e-4),
            'g': createUnit('Gram (g)', 1e-3), 'dag': createUnit('Decagram (dag)', 1e-2), 'oz': createUnit('Ounce', 0.0283495),
            'hg': createUnit('Hectogram (hg)', 0.1), 'lb': createUnit('Pound', 0.453592),
            'kg': createUnit('Kilogram (kg)', 1), 'st': createUnit('Stone', 6.35029),
            'q': createUnit('Quintal', 100), 'ton-short': createUnit('Ton (short)', 907.185),
            't': createUnit('Tonne', 1000), 'ton-long': createUnit('Ton (long)', 1016.05),
        }
    },
    temperature: {
        name: 'Temperature', type: ConversionType.FUNCTIONAL, icon: TempIcon, convert: conversionFormulas.temperature,
        units: {
            'k': createUnit('Kelvin', 1), 'c': createUnit('Celsius (°C)', 1), 'f': createUnit('Fahrenheit (°F)', 1),
            'r': createUnit('Rankine (°R)', 1), 're': createUnit('Réaumur (°Ré)', 1),
        }
    },
    data: {
        name: 'Digital Data', type: ConversionType.STANDARD, icon: DataIcon, baseUnit: 'byte',
        units: {
            'bit': createUnit('Bit', 0.125), 'byte': createUnit('Byte', 1), 
            'kb': createUnit('Kilobyte (kB)', 1e3), 'kib': createUnit('Kibibyte (KiB)', 1024), 
            'mb': createUnit('Megabyte (MB)', 1e6), 'mib': createUnit('Mebibyte (MiB)', Math.pow(1024, 2)),
            'gb': createUnit('Gigabyte (GB)', 1e9), 'gib': createUnit('Gibibyte (GiB)', Math.pow(1024, 3)),
            'tb': createUnit('Terabyte (TB)', 1e12), 'tib': createUnit('Tebibyte (TiB)', Math.pow(1024, 4)),
            'pb': createUnit('Petabyte (PB)', 1e15), 'pib': createUnit('Pebibyte (PiB)', Math.pow(1024, 5)),
            'eb': createUnit('Exabyte (EB)', 1e18), 'eib': createUnit('Exbibyte (EiB)', Math.pow(1024, 6)),
            'zb': createUnit('Zettabyte (ZB)', 1e21), 'zib': createUnit('Zebibyte (ZiB)', Math.pow(1024, 7)),
            'yb': createUnit('Yottabyte (YB)', 1e24), 'yib': createUnit('Yobibyte (YiB)', Math.pow(1024, 8)),
        }
    },
    time: {
        name: 'Time', type: ConversionType.STANDARD, icon: TimeIcon, baseUnit: 's',
        units: {
            'tP': createUnit('Planck Time (tₚ)', 5.39e-44),
            'ys': createUnit('Yoctosecond', 1e-24), 'zs': createUnit('Zeptosecond', 1e-21), 'as': createUnit('Attosecond', 1e-18),
            'fs': createUnit('Femtosecond', 1e-15), 'shake': createUnit('Shake', 1e-8),
            'ps': createUnit('Picosecond', 1e-12), 'ns': createUnit('Nanosecond', 1e-9), 
            'μs': createUnit('Microsecond (µs)', 1e-6), 'ms': createUnit('Millisecond', 1e-3), 'cs': createUnit('Centisecond', 1e-2),
            'ds': createUnit('Decisecond', 0.1), 's': createUnit('Second', 1), 'min': createUnit('Minute', 60), 
            'h': createUnit('Hour', 3600), 'day': createUnit('Day', 86400), 'week': createUnit('Week', 604800), 
            'month': createUnit('Month', 2628000), 'year': createUnit('Year (365 d)', 31536000), 
            'year-sidereal': createUnit('Sidereal Year', 31558149.76),
            'decade': createUnit('Decade', 315576000),
            'century': createUnit('Century', 3155760000), 'millennium': createUnit('Millennium', 31557600000),
        }
    },
    area: {
        name: 'Area', type: ConversionType.STANDARD, icon: AreaIcon, baseUnit: 'm2',
        units: {
            'ym2': createUnit('Sq. Yoctometer', 1e-48), 'zm2': createUnit('Sq. Zeptometer', 1e-42),
            'am2': createUnit('Sq. Attometer', 1e-36), 'fm2': createUnit('Sq. Femtometer', 1e-30),
            'pm2': createUnit('Sq. Picometer', 1e-24), 'nm2': createUnit('Sq. Nanometer', 1e-18),
            'μm2': createUnit('Sq. Micrometer', 1e-12),
            'mm2': createUnit('Sq. Millimeter', 1e-6, 'Sq. Millimeters'), 'cm2': createUnit('Sq. Centimeter', 1e-4, 'Sq. Centimeters'),
            'in2': createUnit('Sq. Inch', 0.00064516, 'Sq. Inches'), 'dm2': createUnit('Sq. Decimeter', 1e-2, 'Sq. Decimeters'), 
            'ft2': createUnit('Sq. Foot', 0.092903, 'Sq. Feet'), 'yd2': createUnit('Sq. Yard', 0.836127, 'Sq. Yards'),
            'm2': createUnit('Sq. Meter', 1, 'Sq. Meters'), 'dam2': createUnit('Sq. Decameter', 100, 'Sq. Decameters'),
            'are': createUnit('Are', 100), 'acre': createUnit('Acre', 4046.86), 'ha': createUnit('Hectare', 10000),
            'hm2': createUnit('Sq. Hectometer', 10000, 'Sq. Hectometers'), 'km2': createUnit('Sq. Kilometer', 1e6, 'Sq. Kilometers'),
            'mi2': createUnit('Sq. Mile', 2.59e6, 'Sq. Miles'),
        }
    },
    volume: {
        name: 'Volume', type: ConversionType.STANDARD, icon: VolumeIcon, baseUnit: 'm3',
        units: {
            // Metric
            'yl': createUnit('Yoctoliter', 1e-27), 'zl': createUnit('Zeptoliter', 1e-24), 'al': createUnit('Attoliter', 1e-21),
            'fl': createUnit('Femtoliter', 1e-18), 'pl': createUnit('Picoliter', 1e-15), 'nl': createUnit('Nanoliter', 1e-12),
            'μl': createUnit('Microliter (µl)', 1e-9), 'mm3': createUnit('Cubic Millimeter', 1e-9, 'Cubic Millimeters'),
            'ml': createUnit('Milliliter', 1e-6), 'cm3': createUnit('Cubic Centimeter', 1e-6, 'Cubic Centimeters'),
            'tsp-us': createUnit('Teaspoon (US)', 4.92892e-6), 'cl': createUnit('Centiliter', 1e-5),
            'tbsp-us': createUnit('Tablespoon (US)', 1.47868e-5), 'in3': createUnit('Cubic Inch', 1.63871e-5, 'Cubic Inches'), 
            'dl': createUnit('Deciliter', 1e-4), 'cup-us': createUnit('Cup (US)', 2.4e-4),
            'pt-us': createUnit('Pint (US)', 4.73176e-4), 'pt-uk': createUnit('Pint (UK)', 5.68261e-4),
            'qt-us': createUnit('Quart (US)', 9.46353e-4), 'l': createUnit('Liter', 1e-3),
            'dm3': createUnit('Cubic Decimeter', 1e-3, 'Cubic Decimeters'), 'qt-uk': createUnit('Quart (UK)', 0.00113652),
            'gal-us': createUnit('Gallon (US)', 0.00378541),'gal-uk': createUnit('Gallon (UK)', 0.00454609),
            'dal': createUnit('Decaliter', 1e-2), 'ft3': createUnit('Cubic Foot', 0.0283168, 'Cubic Feet'),
            'barrel': createUnit('Barrel (oil)', 0.158987), 'hl': createUnit('Hectoliter', 0.1),
            'yd3': createUnit('Cubic Yard', 0.764555, 'Cubic Yards'),
            'm3': createUnit('Cubic Meter', 1), 'kl': createUnit('Kiloliter', 1),
        }
    },
    
    // ==== MATHEMATICS ====
    bases: { name: 'Numerical Base', type: ConversionType.CUSTOM, icon: BaseIcon, component: BaseConverter },
    notations: { name: 'Fractions & Notations', type: ConversionType.CUSTOM, icon: FractionsIcon, component: NotationConverter },

    // ==== SCIENTIFIC ====
    speed: {
        name: 'Speed', type: ConversionType.STANDARD, icon: SpeedIcon, baseUnit: 'm/s',
        units: {
            'mm/s': createUnit('Millimeter/sec', 1e-3), 'cm/s': createUnit('Centimeter/sec', 1e-2),
            'ft/s': createUnit('Foot/sec', 0.3048, 'Feet/sec'), 'km/h': createUnit('Kilometer/hour', 0.277778),
            'mph': createUnit('Miles/hour', 0.44704), 'kn': createUnit('Knot', 0.514444),
            'm/s': createUnit('Meter/sec', 1), 'mach': createUnit('Mach', 343),
            'km/s': createUnit('Kilometer/sec', 1000), 'c': createUnit('Speed of Light (c)', 299792458),
        }
    },
    pressure: {
        name: 'Pressure', type: ConversionType.STANDARD, icon: PressureIcon, baseUnit: 'Pa',
        units: {
            'yPa': createUnit('Yoctopascal', 1e-24), 'zPa': createUnit('Zeptopascal', 1e-21), 'aPa': createUnit('Attopascal', 1e-18),
            'fPa': createUnit('Femtopascal', 1e-15), 'pPa': createUnit('Picopascal', 1e-12), 'nPa': createUnit('Nanopascal', 1e-9),
            'μPa': createUnit('Micropascal (µPa)', 1e-6), 'mPa': createUnit('Millipascal', 1e-3), 'Pa': createUnit('Pascal', 1),
            'mbar': createUnit('Millibar', 100), 'torr': createUnit('Torr', 133.322), 'mmHg': createUnit('mmHg', 133.322),
            'kPa': createUnit('Kilopascal', 1000), 'psi': createUnit('PSI', 6894.76),
            'bar': createUnit('Bar', 100000), 'atm': createUnit('Atmosphere', 101325),
            'MPa': createUnit('Megapascal', 1e6), 'GPa': createUnit('Gigapascal', 1e9),
        }
    },
    energy: {
        name: 'Energy', type: ConversionType.STANDARD, icon: EnergyIcon, baseUnit: 'J',
        units: {
            'eV': createUnit('Electronvolt', 1.60218e-19),
            'zJ': createUnit('Zeptojoule', 1e-21), 'aJ': createUnit('Attojoule', 1e-18), 'fJ': createUnit('Femtojoule', 1e-15),
            'pJ': createUnit('Picojoule', 1e-12), 'nJ': createUnit('Nanojoule', 1e-9), 'μJ': createUnit('Microjoule (µJ)', 1e-6),
            'erg': createUnit('Erg', 1e-7), 'mJ': createUnit('Millijoule', 1e-3), 'J': createUnit('Joule', 1),
            'cal': createUnit('Calorie', 4.184), 'btu': createUnit('BTU', 1055.06),
            'kJ': createUnit('Kilojoule', 1000), 'kcal': createUnit('Kilocalorie', 4184),
            'Wh': createUnit('Watt-hour', 3600),
            'MJ': createUnit('Megajoule', 1e6), 'kWh': createUnit('Kilowatt-hour', 3.6e6),
            'GJ': createUnit('Gigajoule', 1e9), 'MWh': createUnit('Megawatt-hour', 3.6e9),
        }
    },
    power: {
        name: 'Power', type: ConversionType.STANDARD, icon: PowerIcon, baseUnit: 'W',
        units: {
            'yW': createUnit('Yoctowatt', 1e-24), 'zW': createUnit('Zeptowatt', 1e-21), 'aW': createUnit('Attowatt', 1e-18),
            'fW': createUnit('Femtowatt', 1e-15), 'pW': createUnit('Picowatt', 1e-12), 'nW': createUnit('Nanowatt', 1e-9),
            'μW': createUnit('Microwatt (µW)', 1e-6), 'mW': createUnit('Milliwatt', 1e-3), 'W': createUnit('Watt', 1),
            'btu/min': createUnit('BTU/minute', 17.5843), 'cv': createUnit('Metric Horsepower (CV)', 735.49875),
            'hp': createUnit('Horsepower (hp)', 745.7),
            'kW': createUnit('Kilowatt', 1000), 'MW': createUnit('Megawatt', 1e6), 'GW': createUnit('Gigawatt', 1e9),
            'TW': createUnit('Terawatt', 1e12),
        }
    },
    force: {
        name: 'Force', type: ConversionType.STANDARD, icon: ForceIcon, baseUnit: 'N',
        units: {
            'yN': createUnit('Yoctonewton', 1e-24), 'zN': createUnit('Zeptonewton', 1e-21), 'aN': createUnit('Attonewton', 1e-18),
            'fN': createUnit('Femtonewton', 1e-15), 'pN': createUnit('Piconewton', 1e-12), 'nN': createUnit('Nanonewton', 1e-9),
            'μN': createUnit('Micronewton (µN)', 1e-6), 'dyn': createUnit('Dyne', 1e-5),
            'mN': createUnit('Millinewton', 1e-3), 'N': createUnit('Newton', 1),
            'lbf': createUnit('Pound-force', 4.44822), 'kgf': createUnit('Kilogram-force', 9.80665),
            'kN': createUnit('Kilonewton', 1000),
        }
    },
    angle: {
        name: 'Angle', type: ConversionType.STANDARD, icon: AngleIcon, baseUnit: 'rad',
        units: {
            'arcsec': createUnit('Arcsecond (″)', 4.8481e-6), 'mil': createUnit('Mil (NATO)', 0.00098175),
            'arcmin': createUnit('Arcminute (′)', 0.00029089),
            'deg': createUnit('Degree (°)', Math.PI / 180),
            'rad': createUnit('Radian', 1), 'grad': createUnit('Gradian (gon)', Math.PI / 200), 
            'turn': createUnit('Turn', 2 * Math.PI),
        }
    },
    frequency: {
        name: 'Frequency', type: ConversionType.STANDARD, icon: FrequencyIcon, baseUnit: 'hz',
        units: {
            'rpm': createUnit('RPM', 1/60), 'hz': createUnit('Hertz', 1), 'khz': createUnit('Kilohertz', 1e3),
            'mhz': createUnit('Megahertz', 1e6), 'ghz': createUnit('Gigahertz', 1e9),
            'thz': createUnit('Terahertz', 1e12),
        }
    },
    density: {
        name: 'Density', type: ConversionType.STANDARD, icon: DensityIcon, baseUnit: 'kg/m3',
        units: {
            'lb/ft3': createUnit('lb/ft³', 16.0185), 'oz/in3': createUnit('oz/in³', 1729.99),
            'kg/m3': createUnit('kg/m³', 1), 'g/cm3': createUnit('g/cm³', 1000),
        }
    },
    current: {
        name: 'Electric Current', type: ConversionType.STANDARD, icon: CurrentIcon, baseUnit: 'A',
        units: {
            'pA': createUnit('Picoampere', 1e-12), 'nA': createUnit('Nanoampere', 1e-9), 'µA': createUnit('Microampere', 1e-6),
            'mA': createUnit('Milliampere', 1e-3), 'A': createUnit('Ampere', 1), 'kA': createUnit('Kiloampere', 1e3),
        }
    },
    charge: {
        name: 'Electric Charge', type: ConversionType.STANDARD, icon: ChargeIcon, baseUnit: 'C',
        units: {
            'e': createUnit('Elementary Charge (e)', 1.602176634e-19), 'pC': createUnit('Picocoulomb', 1e-12),
            'nC': createUnit('Nanocoulomb', 1e-9), 'µC': createUnit('Microcoulomb', 1e-6),
            'mC': createUnit('Millicoulomb', 1e-3), 'C': createUnit('Coulomb', 1),
            'kC': createUnit('Kilocoulomb', 1e3), 'Ah': createUnit('Ampere-hour', 3600),
        }
    },
    voltage: {
        name: 'Voltage', type: ConversionType.STANDARD, icon: VoltageIcon, baseUnit: 'V',
        units: {
            'µV': createUnit('Microvolt', 1e-6), 'mV': createUnit('Millivolt', 1e-3),
            'V': createUnit('Volt', 1), 'kV': createUnit('Kilovolt', 1e3),
        }
    },
    resistance: {
        name: 'Resistance', type: ConversionType.STANDARD, icon: ResistanceIcon, baseUnit: 'ohm',
        units: {
            'µΩ': createUnit('Microhm', 1e-6), 'mΩ': createUnit('Milliohm', 1e-3),
            'Ω': createUnit('Ohm', 1), 'kΩ': createUnit('Kiloohm', 1e3), 'MΩ': createUnit('Megaohm', 1e6),
        }
    },
    substance: {
        name: 'Amount of Substance', type: ConversionType.STANDARD, icon: SubstanceIcon, baseUnit: 'mol',
        units: {
            'mol': createUnit('Mole', 1), 'kmol': createUnit('Kilomole', 1e3),
        }
    },
    luminousIntensity: {
        name: 'Luminous Intensity', type: ConversionType.STANDARD, icon: LuminousIcon, baseUnit: 'cd',
        units: { 'cd': createUnit('Candela', 1) }
    },

    // ==== HEALTH ====
    bmi: { name: 'BMI Calculator', type: ConversionType.CUSTOM, icon: BmiIcon, component: BmiCalculator },
    bmr: { name: 'BMR Calculator', type: ConversionType.CUSTOM, icon: BmrIcon, component: BmrCalculator },

    // ==== FUNCTIONAL & CUSTOM ====
    fuel: {
        name: 'Fuel Consumption', type: ConversionType.FUNCTIONAL, icon: FuelIcon, convert: conversionFormulas.fuel,
        units: {
            'km/l': createUnit('km/L', 1), 'l/100km': createUnit('L/100km', 1),
            'mpg-us': createUnit('MPG (US)', 1), 'mpg-uk': createUnit('MPG (UK)', 1),
        },
    },
    illuminance: {
        name: 'Illuminance', type: ConversionType.STANDARD, icon: IlluminanceIcon, baseUnit: 'lux',
        units: { 'lux': createUnit('Lux', 1), 'fc': createUnit('Foot-candle', 10.764, 'Foot-candles') }
    },
    sound: {
        name: 'Sound', type: ConversionType.FUNCTIONAL, icon: SoundIcon, convert: conversionFormulas.sound,
        units: { 'db': createUnit('Decibel', 1), 'np': createUnit('Neper', 1)}
    },
    radioactivity: {
        name: 'Radioactivity', type: ConversionType.STANDARD, icon: RadioactivityIcon, baseUnit: 'Bq',
        units: { 'Bq': createUnit('Becquerel', 1), 'Ci': createUnit('Curie', 3.7e10) }
    },
    magneticInduction: {
        name: 'Magnetic Induction', type: ConversionType.STANDARD, icon: MagnetismIcon, baseUnit: 'T',
        units: { 'G': createUnit('Gauss', 0.0001), 'T': createUnit('Tesla', 1) }
    },
    magneticFlux: {
        name: 'Magnetic Flux', type: ConversionType.STANDARD, icon: MagnetismIcon, baseUnit: 'Wb',
        units: { 'Mx': createUnit('Maxwell', 1e-8), 'Wb': createUnit('Weber', 1) }
    },
    flow: {
        name: 'Flow Rate', type: ConversionType.STANDARD, icon: FlowIcon, baseUnit: 'm3/s',
        units: { 
            'gpm-us': createUnit('Gallon/min (US)', 0.0000630902), 'L/s': createUnit('L/s', 0.001), 
            'ft3/min': createUnit('ft³/min', 0.000471947, 'ft³/min'), 'm3/s': createUnit('m³/s', 1)
        }
    },
    logic: { name: 'Logic', type: ConversionType.CUSTOM, icon: LogicIcon, component: LogicConverter },
    currency: { name: 'Currency', type: ConversionType.CUSTOM, icon: CurrencyIcon, component: CurrencyConverter },
};