import React from 'react';

export function DataTable({ columns, data, className = '' }) {
  return (
    <table className={`${className}`}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className={column.className}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex} className={column.className}>
                {column.render ? column.render(row) : row[column.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
