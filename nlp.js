const S = require ('sanctuary');
const stopwords = require('./stopwords.js').english
const {stemmer} = require('./stemmer.js')
// var WordPOS = require('wordpos'),
//     wordpos = new WordPOS();

const nlp = x => {
  const stringify = x => x.toString()

  // :: str -> str
  const toLowerCase = x => x.toLowerCase();

  // :: str -> str
  const replace = x => y => z => x.replace(y, z)

  // :: str -> str
  const remove = x => y => replace(x)(y)('');

  // :: str -> str
  const removeLineBreaks = x => remove(x)(/(\r\n|\n|\r)/gm)

  // :: str -> str
  const removePunctuation = x => remove(x)(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)

  // :: str -> boolean
  const isStopword = x => stopwords.includes(x);

  // :: [] -> []
  const removeEnglishStopwords = x => S.reject(isStopword)(x);

  // :: str -> array
  const split = x => y => x.split(y);

  // :: str -> array
  const tokenize = x => split(x)(' ');

  // :: [] -> []
  const stemAllTokens = x => S.map(stemmer)(x)

  // :: str -> object
  // const getPos = x => wordpos.getPOS(x);

  const getCounts = x => x.reduce(function (acc, curr) {
      if (typeof acc[curr] == 'undefined') {
        acc[curr] = 1;
      } else {
        acc[curr] += 1;
      }
      return acc;
    }, {}
  );

  // :: str -> str
  const cleanText = S.pipe([
    //     -> str
    stringify,
    // str -> str
    removeLineBreaks,
    // str -> str
    removePunctuation,
    // str -> str
    toLowerCase
  ])

  // :: str -> object
  const nlpPipeline = S.pipe([
      // str -> str
      cleanText,
      // str -> array
      tokenize,
      // array -> array
      removeEnglishStopwords,
      // array -> array
      stemAllTokens,
      // array -> object
      getCounts
  ]);

  return nlpPipeline(x)
}

module.exports = {
  nlp
};