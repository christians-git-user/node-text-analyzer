const S = require ('sanctuary');
const stopwords = require(`./stopwords.js`).english
const {stemmer} = require(`./stemmer.js`)
var WordPOS = require('wordpos'),
    wordpos = new WordPOS();

// str -> str
const toLowerCase = x => x.toLowerCase();

// :: str -> str
const replace = x => y => z => x.replace(y, z)

// :: str -> str
const remove = x => y => replace(x)(y)(``);

const removeLineBreaks = x => remove(x)(/(\r\n|\n|\r)/gm)

const removePunctuation = x => remove(x)(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)

// fix this
const isStopword = x => stopwords.includes(x);

const removeStopwords = x => S.reject(isStopword)(x);

// :: str -> array
const split = x => y => x.split(y);

const tokenize = x => split(x)(` `);

const stemAllTokens = x => S.map(stemmer)(x)

const getPos = x => wordpos.getPOS(x);

const getCounts = x => x.reduce(function (acc, curr) {
    if (typeof acc[curr] == 'undefined') {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
  
    return acc;
  }, {});

  const sort = x => x.sort()

const nlp = S.pipe([
    removeLineBreaks,
    removePunctuation,
    toLowerCase,
    tokenize,
    removeStopwords,
    stemAllTokens,
    getCounts,
    // sort,
    console.log
]);

const test = `THE DOORS 
of the ~D train slid shut, and as I dropped into a seat and, 
exhaling, looked up across the aisle, the whole aviary in my head burst 
into song. She was a living doll and no mistake- the blue-black bang, 
the wide cheekbones, olive-flushed, that betrayed the Cherokee strain 
in her Midwestern lineage, and the mouth whose only fault, in the 
novelist's carping phrase, was that the lower lip was a trifle too 
voluptuous. From what I was able to gauge in a swift, greedy glance, 
the figure inside the coral-colored boucle dress was stupefying. drop drop
`

nlp(test)
// getPos(test).then(console.log)