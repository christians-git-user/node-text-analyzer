const {expect} = require('chai');

const {nlp} = require('../nlp.js')

describe('nlp', () => {
    it('return an object', () => {
        const testBody = {
            input: 'test test test test'
        }
        const test = nlp(testBody)
        console.log(test)
        expect(test).to.be.a('object')
    })
    it('when given an input with a string, nlp will count the number of stemmed words in that string', () => {
        const testBody = {
            input: 'test test test test'
        }
        const result = { test: 4 };
        const test = nlp(testBody)
        console.log(test)
        expect(test).to.deep.equals(result)
    })
});