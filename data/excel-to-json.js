const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('🔍 Current folder:', __dirname);

// Your Excel file name — UPDATE THIS to match EXACTLY
const excelFile = 'MAIN_DATA.xlsx';

console.log('📂 Looking for file:', excelFile);
console.log('📍 File exists?', fs.existsSync(excelFile) ? '✅ YES' : '❌ NO — check the filename!');

try {
  const workbook = XLSX.readFile(excelFile);
  const sheetNames = workbook.SheetNames;
  console.log('📋 Sheets found:', sheetNames);

  sheetNames.forEach(name => {
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    const outputFile = `${name}.json`;
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log(`✅ Saved: ${outputFile} (${data.length} rows)`);
  });

  console.log('\n🎉 ALL DONE! Check your folder for the .json files');
} catch (err) {
  console.error('❌ Error:', err.message);
}
