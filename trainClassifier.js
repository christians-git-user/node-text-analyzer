const { NlpManager } = require('node-nlp');
const {csvStream} = require('./csv.js')
 
const manager = new NlpManager({ languages: ['en'] });

// First column = utterance, second column = label
const addTrainingDocument = pair => {
    const utterance = pair[0]
    const intent = pair[1]
    return manager.addDocument('en', utterance, intent)
}

const trainClassifierFromCsvData = filepath =>
    csvStream(filepath, addTrainingDocument)
    .then(async() => {
        await manager.train();
        manager.save();
        // const response = await manager.process('en', 'glitch');
        // console.log(response.nluAnswer);
    });

module.exports = {
    trainClassifierFromCsvData
  };