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
};
