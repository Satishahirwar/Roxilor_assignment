import React, { useState } from 'react';
import MonthDropdown from './components/MonthDropdown';
import TransactionTable from './components/TransactionTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
    const [selectedMonth, setSelectedMonth] = useState(3); // Default to March
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-black text-black p-6">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-400">
                Transaction Dashboard
            </h1>

            {/* Month Dropdown */}
            <div className="flex justify-center mb-6">
                <MonthDropdown selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
                <input
                    type="text"
                    className="bg-gray-800 border border-gray-600 text-white rounded-lg py-2 px-4 shadow-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Transaction Table */}
            <div className="mb-10">
                <TransactionTable selectedMonth={selectedMonth} searchQuery={searchQuery} />
            </div>

            {/* Statistics */}
            <div className="mb-10">
                <Statistics selectedMonth={selectedMonth} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-400 mb-4">Price Ranges</h2>
                    <BarChart selectedMonth={selectedMonth} />
                </div>
                <div className="bg-gray-800 shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-blue-400 mb-4">Category Distribution</h2>
                    <PieChart selectedMonth={selectedMonth} />
                </div>
            </div>
        </div>
    );
};

export default App;
