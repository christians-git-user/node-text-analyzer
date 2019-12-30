const http = require(`http`);
const fs = require(`fs`)

const getBrownCorpus = () => http.get(`http://www.sls.hawaii.edu/bley-vroman/brown.txt`, (resp) => {
    let data = '';
  
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(data);
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  })

  module.exports = {
      getBrownCorpus
  }