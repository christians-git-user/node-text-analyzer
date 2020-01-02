const S = require ('sanctuary');
const stopwords = require(`./stopwords.js`).english
const {stemmer} = require(`./stemmer.js`)
// var WordPOS = require('wordpos'),
//     wordpos = new WordPOS();

// str -> str
const toLowerCase = x => x.toLowerCase();
// :: str -> str
const replace = x => y => z => x.replace(y, z)
// :: str -> str
const remove = x => y => replace(x)(y)(``);
// :: str -> str
const removeLineBreaks = x => remove(x)(/(\r\n|\n|\r)/gm)
// :: str -> str
const removePunctuation = x => remove(x)(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)
// :: str -> boolean
const isStopword = x => stopwords.includes(x);
// :: [] -> []
const removeStopwords = x => S.reject(isStopword)(x);
// :: str -> array
// const split = x => y => x.split(y);
// :: str -> array
const tokenize = x => x.split(` `);
// :: [] -> []
const stemAllTokens = x => S.map(stemmer)(x)
// :: str -> object
// const getPos = x => wordpos.getPOS(x);

const stringify = x => {
  console.log(x)
  return x.toString()
}

const getCounts = x => x.reduce(function (acc, curr) {
    if (typeof acc[curr] == 'undefined') {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
    return acc;
  }, {}
);

// :: str -> object
const nlp = S.pipe([
    stringify,
    // str -> str
    removeLineBreaks,
    // str -> str
    removePunctuation,
    // str -> str
    toLowerCase,
    // str -> array
    tokenize,
    // array -> arraysplit(x)
    removeStopwords,
    // array -> array
    stemAllTokens,
    // array -> object
    getCounts
]);

module.exports = {
  nlp
};