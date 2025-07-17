
import React from 'react';
import { AmortizationRow } from '../../lib/finance';

interface AmortizationTableProps {
    schedule: AmortizationRow[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
    if (schedule.length === 0) return null;

    return (
        <div className="bg-base-200 p-4 rounded-xl mt-6">
            <h3 className="font-bold text-lg mb-3 text-center">Amortization Schedule</h3>
            <div className="max-h-96 overflow-y-auto result-scroll">
                <table className="w-full text-sm text-left table-auto">
                    <thead className="sticky top-0 bg-base-300 text-base-content/80 z-10">
                        <tr>
                            <th className="p-2 font-semibold">Month</th>
                            <th className="p-2 font-semibold text-right">Payment</th>
                            <th className="p-2 font-semibold text-right">Principal</th>
                            <th className="p-2 font-semibold text-right">Interest</th>
                            <th className="p-2 font-semibold text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-base-300/50">
                        {schedule.map(row => (
                            <tr key={row.month} className="hover:bg-base-300/50 font-mono">
                                <td className="p-2 font-sans font-semibold">{row.month}</td>
                                <td className="p-2 text-right">{formatCurrency(row.payment)}</td>
                                <td className="p-2 text-right text-green-600 dark:text-green-400">{formatCurrency(row.principal)}</td>
                                <td className="p-2 text-right text-red-600 dark:text-red-400">{formatCurrency(row.interest)}</td>
                                <td className="p-2 text-right font-sans font-semibold">{formatCurrency(row.remainingBalance)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AmortizationTable;
