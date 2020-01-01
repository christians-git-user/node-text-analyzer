const { request } = require('http')

const Future = require('fluture')
const {env: flutureEnv} = require('fluture-sanctuary-types');

const {create, env, curry3} = require('sanctuary');
// const {curry3}  = create({
//     checkTypes: process.env.NODE_ENV !== 'production',
//     env: env.concat(flutureEnv)
// });

const httpGetFuture = (host, path) => 
    Future(function httpGet(reject, resolve) {
        const options = {
            method: `GET`,
            hostname: host,
            path: path
        }

        console.log(options)
        
        const req = request.request(JSON.stringify(options), (resp) => {
            const chunks = [];
        
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                chunks.push(chunk);
            });
        
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                const body = Buffer.concat(chunks)
                resolve(body)
            });
        })

        console.log(req)
        
        req.on("error", (err) => {
            console.log("Error: " + err.message);
            reject(console.error(err.message))
        })
    })

const getOptionsBrownCorpus = (host, path) => {
    console.log(path)
    return httpGetFuture(host, path)
}
    
getOptionsBrownCorpus(`sls.hawaii.edu`, `/bley-vroman/brown.txt`)


module.exports = {
    httpGetFuture
}
