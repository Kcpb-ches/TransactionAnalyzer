const fs = require('fs');

function cleanAmount(val) {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return Math.abs(val);
    const cleaned = String(val).replace(/,/g, '').replace(/[^0-9.-]+/g, "");
    return Math.abs(parseFloat(cleaned)) || 0;
}

// 模擬 Papa.parse (這裡只簡單切出第一二行)
const csvData = fs.readFileSync('/Users/hua/Desktop/Anti/Account/D11501003157_02.csv', 'utf-8');
const lines = csvData.split('\n');
const headers = lines[0].split(',').map(s => s.replace(/"/g,''));

console.log("Original Headers:", headers);

// 去除欄位名稱的頭尾空白
const row1 = lines[10].split(',').map(s => s.replace(/"/g,'')); // 取有數字的一行測試 (line 11 in index, index 10 here)
console.log("Row 1 data:", row1);

const parsedRow = {};
headers.forEach((h, i) => {
    parsedRow[h] = row1[i];
});

console.log("Parsed row directly from CSV:", parsedRow);

const cleanedRow = {};
for (let key in parsedRow) {
    cleanedRow[key.trim()] = typeof parsedRow[key] === 'string' ? parsedRow[key].trim() : parsedRow[key];
}

console.log("Cleaned Row:", cleanedRow);

const expense = cleanAmount(cleanedRow['支出金額']);
const income = cleanAmount(cleanedRow['存入金額']);
const amount = expense > 0 ? expense : income;

console.log("Expense:", expense, "Income:", income, "Amount:", amount);
console.log("\n");
