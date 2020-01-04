const csv = require('csv-parse');
const fs = require('fs');

const csvStream = (filepath, transformation) =>
    new Promise((resolve, reject) => {
        const concatenated = []
        fs.createReadStream(filepath)
        .pipe(csv({ delimiter: ',', from_line: 2 }))
        .on('data', (row) => {
          transformation(row)
          concatenated.push(row)
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
          resolve(concatenated)
        });
    })

module.exports = {
  csvStream
};