const fs = require('fs');
const Papa = require('papaparse');
let csvData = fs.readFileSync('/Users/hua/Desktop/Anti/Account/存款往來明細資料-1.csv', 'utf-8');
csvData = csvData.replace(/\r\n|\r|\n/g, '\n');
Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
        console.log('Headers:', results.meta.fields);

        let uniqueDesc = new Set();
        let uniqueRemark = new Set();
        results.data.forEach(r => {
            if (r['交易摘要']) uniqueDesc.add(r['交易摘要'].trim());
            // also look for anything that could mean cash/atm
            const fields = Object.values(r).join(' ');
            if (fields.match(/現金|ATM|提|存/)) {
                // If this row might be cash, let's log the whole row occasionally
            }
        });

        console.log('Unique 交易摘要:', Array.from(uniqueDesc).slice(0, 10)); // just sample

        // Find rows without long account B but with IN/OUT amount
        const suspectCash = results.data.filter(r => {
            let amount = Number((r['支出金額'] || '0').replace(/,/g, '')) + Number((r['存入金額'] || '0').replace(/,/g, ''));
            let accB = (r['轉出入行庫代碼及帳號'] || '').trim();
            return amount > 0 && accB.length <= 8;
        });

        console.log('Sample suspect cash rows:');
        suspectCash.slice(0, 15).forEach(r => console.log(JSON.stringify(r)));
    }
});
