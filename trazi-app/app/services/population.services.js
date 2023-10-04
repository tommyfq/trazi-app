const db = require("../models");
const Population = db.populations;
const redisClient = require("./redis-client.services")
const {CODE_BAD_REQUEST, CODE_ERROR_SYSTEM, CODE_SUCCESS_NEW, CODE_SUCCESS_UPDATE, RESPONSE_MESSAGE} = require("../config/const.config")

async function getPopulation(paramCity,paramState){
    
    try {
        var key = paramCity+"-"+paramState
        redisData = await redisClient.getAsync(key)
        console.log("===REDIS_DATA===")
        console.log(redisData)
        if(redisData){
            return {
                code:CODE_SUCCESS_UPDATE, 
                data:redisData
            } 
        }else{
            var whereCity = paramCity ? {city:{ $regex: new RegExp(`^${paramCity}$`), $options:"i"}} : {};
            var whereState = paramState ? {state:{ $regex: new RegExp(`^${paramState}$`), $options:"i"}} : {};
            
            var condition = {
                $and: [whereCity, whereState]
            }
        
            const data = await Population.findOne(condition)

            if(!data){
                return {
                    code:CODE_BAD_REQUEST, 
                    data:"Data not found"
                }
            }

            var isRedisSet = await redisClient.setAsync(key,data.population)
            
            if(!isRedisSet){
                return {
                    code:CODE_ERROR_SYSTEM,
                    data:RESPONSE_MESSAGE[CODE_ERROR_SYSTEM]
                }
            }

            return {
                code:CODE_SUCCESS_UPDATE, 
                data:data.population
            } 
        }
        
    } catch(err) {
        return {
            code:CODE_ERROR_SYSTEM, 
            data:err.message
        }  
    }
}

async function putPopulation(paramCity,paramState,pop){{
    var result = await getPopulation(paramCity,paramState)

    if(result.code != CODE_SUCCESS_UPDATE){
        return result
    }

    var key = paramCity+"-"+paramState

    console.log("===DATA===")
    console.log(result.data)
    if(result.data){
        //update

        // Define the condition to match documents for update
        const condition = { city: paramCity, state: paramState };

        // Define the update operation
        const update = { $set: { population: pop } };
        
        try{
            var resSave = await Population.update(condition,update)
            
            if(resSave){
                console.log("MASUK SAVE ?")
                //add handle error code
                console.log("KEY : "+key)
                console.log("POP : "+pop)
                var isRedisSet = await redisClient.setAsync(key,pop)
                console.log("IS REDIS SET" + isRedisSet);
                if(!isRedisSet){
                    console.log("MASUK ERROR");
                    return {
                        code:CODE_ERROR_SYSTEM,
                        data:RESPONSE_MESSAGE[CODE_ERROR_SYSTEM]
                    }
                }
            }
            return {
                code:CODE_SUCCESS_UPDATE,
                data:RESPONSE_MESSAGE[CODE_SUCCESS_UPDATE]
            }
        }catch(err){
            return { 
                code:CODE_ERROR_SYSTEM,
                data: err.message
            }
        }
        

    }else{
        //create
        const population = new Population({
            state: paramState,
            city: paramCity,
            population: pop
        });
        
        try{
            var resSave = await population.save(population)
            if(resSave){
                //add handle error code
                var isRedisSet = await redisClient.setAsync(key,pop)

                if(!isRedisSet){
                    return {
                        code:CODE_ERROR_SYSTEM,
                        data:RESPONSE_MESSAGE[CODE_ERROR_SYSTEM]
                    }
                }
            }
            return {
                code:CODE_SUCCESS_NEW,
                data:RESPONSE_MESSAGE[CODE_SUCCESS_NEW]
            }
        }catch(err){
            return { 
                code:CODE_ERROR_SYSTEM,
                data: err.message
            }
        }
        
    }
}}

module.exports = {
    getPopulation,
    putPopulation
}