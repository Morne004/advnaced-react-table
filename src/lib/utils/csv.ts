
export const exportToCsv = <T extends object>(filename: string, rows: T[]) => {
    if (!rows || rows.length === 0) {
        console.error("No data to export.");
        return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]) as (keyof T)[];
    const csvContent =
        keys.map(k => `"${String(k)}"`).join(separator) +
        '\n' +
        rows
            .map(row => {
                return keys
                    .map(k => {
                        let cell = row[k] === null || row[k] === undefined ? '' : row[k];
                        let cellString = String(cell).replace(/"/g, '""');
                        if (cellString.search(/("|,|\n)/g) >= 0) {
                            cellString = `"${cellString}"`;
                        }
                        return cellString;
                    })
                    .join(separator);
            })
            .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};