const {pipe, map} = require(`sanctuary`);
const {getBrownCorpus} = require(`./getTestData.js`)

const remove = x => x.replace(``);

// :: str -> array
const split = x => y => x.split(y);

const tokenize = x => split(x)(` `);

const toLowerCase = x => x.toLowerCase();

const nlp = pipe([
    tokenize,
    map(toLowerCase),
    console.log
])

const test = `THE DOORS 
of the ~D train slid shut, and as I dropped into a seat and, 
exhaling, looked up across the aisle, the whole aviary in my head burst 
into song. She was a living doll and no mistake- the blue-black bang, 
the wide cheekbones, olive-flushed, that betrayed the Cherokee strain 
in her Midwestern lineage, and the mouth whose only fault, in the 
novelist's carping phrase, was that the lower lip was a trifle too 
voluptuous. From what I was able to gauge in a swift, greedy glance, 
the figure inside the coral-colored boucle dress was stupefying.
`

nlp(test)