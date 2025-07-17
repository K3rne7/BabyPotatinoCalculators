
import React from 'react';
import DescriptiveStatistics from '../statistics/DescriptiveStatistics';

const StatisticsCalculator: React.FC = () => {
    // In the future, we can have state here to switch between different stat tools
    // e.g., Descriptive, Distributions, Hypothesis Tests...
    return (
        <div className="flex flex-col h-full gap-4">
            <DescriptiveStatistics />
        </div>
    );
};

export default StatisticsCalculator;
