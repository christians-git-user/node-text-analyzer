const {nlp} = require('./nlp');

module.exports.nlp = async event => {
  try{
    console.log('request event = ', event);
    const requestBody = JSON.parse(event.body)
    const analyzedText = nlp(requestBody)

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          request: requestBody,
          stemmed_word_count: analyzedText
        },
        null,
        2
      ),
    };
  } catch(error){
    
    console.log('Error: ', error);
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          Message: error
        },
        null,
        2
      ),
    }
  }
};
