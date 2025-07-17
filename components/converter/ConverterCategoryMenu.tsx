

import React from 'react';
import { conversionCategories } from '../../lib/conversions';
import { ConversionType } from '../../types';

interface ConverterCategoryListProps {
  activeCategoryKey: string;
  onSelectCategory: (key: string) => void;
}

const isCategoryImplemented = (key: string): boolean => {
    const category = conversionCategories[key];
    if (!category) return false;
    if (category.type === ConversionType.CUSTOM) {
        return !!category.component;
    }
    return !!category.units && Object.keys(category.units).length > 0;
};


const ConverterCategoryList: React.FC<ConverterCategoryListProps> = ({ activeCategoryKey, onSelectCategory }) => {
    
  const common = ['length', 'mass', 'temperature', 'data', 'time', 'area', 'volume'];
  const mathematical = ['bases', 'notations', 'angle'];
  const health = ['bmi', 'bmr'];
  const scientific = [
      'speed', 'pressure', 'energy', 'power', 'force', 'density', 'flow', 'frequency',
      'current', 'voltage', 'charge', 'resistance', 'magneticInduction', 'magneticFlux', 
      'substance', 'luminousIntensity', 'illuminance', 'radioactivity', 
      'sound', 'fuel'
  ];
  const other = ['logic', 'currency'];

  const renderCategoryButton = (key: string) => {
    const category = conversionCategories[key];
    if (!category) return null;
    
    const isActive = activeCategoryKey === key;
    const Icon = category.icon;

    return (
      <button
        key={key}
        onClick={() => onSelectCategory(key)}
        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors duration-200 cursor-pointer text-base-content
            ${isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-base-300'}
        `}
        title={category.name}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-primary'}`} />
        <span className="flex-grow truncate">{category.name}</span>
      </button>
    );
  };
  
  const renderSection = (title: string, keys: string[]) => {
    const validKeys = keys.filter(key => conversionCategories[key] && isCategoryImplemented(key));
    if (validKeys.length === 0) return null;
    
    return (
        <div key={title}>
            <h3 className="px-2.5 py-2 text-xs font-bold text-base-content/50 uppercase tracking-wider">{title}</h3>
            <div className="space-y-1">
                {validKeys.map(renderCategoryButton)}
            </div>
        </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-2 space-y-4 result-scroll">
      <h2 className="text-xl font-bold text-base-content p-2.5 pt-2 flex-shrink-0">Categories</h2>
      {renderSection('Common', common)}
      {renderSection('Health', health)}
      {renderSection('Mathematics', mathematical)}
      {renderSection('Scientific', scientific)}
      {renderSection('Other', other)}
    </div>
  );
};

export default ConverterCategoryList;