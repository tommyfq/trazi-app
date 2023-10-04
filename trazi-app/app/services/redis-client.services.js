const redis = require('redis');
const {promisify} = require('util');
const redisConfig = require('../config/redis.config')
const client = redis.createClient({url:redisConfig.url});

client.on('error', (err) => {
    console.error('Redis Error:', err);
  });


client.connect()

const getAsync = async (key) => {
    try{
        const data = await client.get(key)
        return data
    }catch(err){
        return false
    }
}

const setAsync = async (key,value) => {
    try {
        console.log("UPDATING...")
        const data = await client.set(key,value)
        console.log("DONE...")
        console.log(data)
        return true
    }catch(err){
        return false
    }
}

  //const getAsync = promisify(client.get).bind(client);
  //const setAsync = promisify(client.set).bind(client);

module.exports = {
  getAsync,
  setAsync
};