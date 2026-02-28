const fs = require('fs');
const Papa = require('papaparse');
const csvData = fs.readFileSync('/Users/hua/Desktop/Anti/Account/D11501003157_02.csv', 'utf-8');
console.log("CSV length:", csvData.length);
Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
        console.log("Data length:", results.data.length);
        if (results.data.length > 0) {
            console.log("First element:", results.data[0]);
        }
    }
});
