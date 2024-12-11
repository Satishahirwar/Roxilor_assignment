import React from 'react';

const MonthDropdown = ({ selectedMonth, onMonthChange }) => {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <select value={selectedMonth} onChange={(e) => onMonthChange(e.target.value)}>
            {months.map((month, index) => (
                <option key={index} value={index + 1}>
                    {month}
                </option>
            ))}
        </select>
    );
};

export default MonthDropdown;
