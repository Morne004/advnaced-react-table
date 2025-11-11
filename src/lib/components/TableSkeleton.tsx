import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  cols: number;
}
// This is a headless component. The parent should apply styles.
// A simple implementation for demonstration.
export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              <div>
                &nbsp;
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
