const {
    REDIS_HOST,
    REDIS_PASSWORD,
    REDIS_PORT,
  } = process.env;
  
  module.exports = {
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
  };