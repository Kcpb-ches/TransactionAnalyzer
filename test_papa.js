const fs = require('fs');
const Papa = require('papaparse'); // need to npm install papaparse if not there

function cleanAmount(val) {
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return Math.abs(val);
    const cleaned = String(val).replace(/,/g, '').replace(/[^0-9.-]+/g, "");
    return Math.abs(parseFloat(cleaned)) || 0;
}

function padAccount(accStr) {
    if (!accStr) return '';
    const str = String(accStr).trim();
    if (str === '') return '';
    return str.padStart(16, '0');
}

const csvData = fs.readFileSync('/Users/hua/Desktop/Anti/Account/D11501003157_02.csv', 'utf-8');

Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
        console.log("Papa results metadata:", results.meta.fields);

        let row1 = results.data[9]; // line 10 data
        const cleanedData = results.data.map(row => {
            const newRow = {};
            for (let key in row) {
                newRow[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : row[key];
            }
            return newRow;
        });

        console.log("Original row 10:", row1);
        console.log("Cleaned row 10:", cleanedData[9]);

        let cRow = cleanedData[9];
        const sourceAcc = padAccount(cRow['帳號'] || '');
        const rawTarget = String(cRow['轉出入行庫代碼及帳號'] || cRow['轉出入行'] || '').trim();

        const expense = cleanAmount(cRow['支出金額']);
        const income = cleanAmount(cRow['存入金額']);
        const amount = expense > 0 ? expense : income;

        console.log("sourceAcc:", sourceAcc, "expense:", expense, "income:", income, "amount:", amount);

        // test filter logic
        const normalizedTrans = cleanedData.map(r => {
            const sourceAcc = padAccount(r['帳號'] || '');
            const rawTarget = String(r['轉出入行庫代碼及帳號'] || r['轉出入行'] || '').trim();
            const expense = cleanAmount(r['支出金額']);
            const income = cleanAmount(r['存入金額']);
            const amount = expense > 0 ? expense : income;
            return {
                accountA: sourceAcc,
                amount: amount
            };
        });

        const validTrans = normalizedTrans.filter(t => t.accountA !== '' && t.amount > 0);
        console.log("Total entries:", normalizedTrans.length);
        console.log("Valid entries:", validTrans.length);

        if (validTrans.length === 0) {
            console.log("Sample of 5 parsed objects:");
            console.log(normalizedTrans.slice(10, 15));
        }
    }
});
