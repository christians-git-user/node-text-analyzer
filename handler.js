const {nlp} = require('./nlp');

module.exports.nlp = async event => {
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

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
