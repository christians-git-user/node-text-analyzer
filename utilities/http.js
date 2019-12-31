const { request } = require('http')

const Future = require('fluture')
const {env: flutureEnv} = require('fluture-sanctuary-types');

const {create, env, curry2} = require('sanctuary');
// const {curry3}  = create({
//     checkTypes: process.env.NODE_ENV !== 'production',
//     env: env.concat(flutureEnv)
// });

const httpGetFuture = curry2((url, headers) => 
    Future(function httpGet(reject, resolve) {
        return request.get(url, headers, (resp) => {
            let data = '';
        
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
            data += chunk;
            });
        
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
            console.log(data);
            resolve(data)
            });
        
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        })
    })
)
   
    
httpGetFuture(`http://www.sls.hawaii.edu/bley-vroman/brown.txt`) 
.fork(console.error, console.log)

module.exports = {
    httpGetFuture
}
