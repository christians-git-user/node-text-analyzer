const { NlpManager } = require('node-nlp');
const {csvStream} = require('../utilities/csv.js')
 
const manager = new NlpManager({ languages: ['en'] });

// First column = utterance, second column = label
const addTrainingDocument = pair => {
    const utterance = pair[0]
    const intent = pair[1]
    console.log('adding utterance')
    manager.addDocument('en', utterance, intent)
}

async function trainClassifierFromCsvData (filepath) {
    console.log('trainClassifier invoked')
    csvStream(filepath, addTrainingDocument)
    .then(async() => {
        console.log('...start training...')
        await manager.train();
        await manager.save('/tmp/model.nlp')
        .then(() => {
            fs.readFile('tmp/mpdel.nlp', 'utf-8', async data => {
                const s3Params = {
                    Bucket: 'node-text-classify-train',
                    Key: 'model.nlp',
                    Body: data
                  }
                return s3.putObject(s3Params, function (err) {
                    if (err) { throw err; }
                  });
            })
        });
        // const response = await manager.process('en', 'glitch');
        // console.log(response.nluAnswer);
    });
}

module.exports = {
    trainClassifierFromCsvData
  };