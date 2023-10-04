const populationService = require("../services/population.services")
const {CODE_BAD_REQUEST, CODE_ERROR_SYSTEM, CODE_SUCCESS_NEW, CODE_SUCCESS_UPDATE, RESPONSE_MESSAGE} = require("../config/const.config")
const helper = require('../helpers/general.helper')

async function create(req,res){
    var pop = req.body;
    var paramCity = req.params.city
    var paramState = req.params.state

    let regex = /^[^a-zA-Z]*$/;

    //if(helper.isLetter(paramCity)){
    if(regex.test(paramCity)){
        return res.status(CODE_BAD_REQUEST).send({message:"City is invalid"})
    }

    if(regex.test(paramState)){
        return res.status(CODE_BAD_REQUEST).send({message:"State is in valid"})
    }

    var {code, data} = await populationService.putPopulation(paramCity.toLowerCase(),paramState.toLowerCase(),pop)

    return res.status(code).send({message:data}) 

}

async function get(req,res){
    var paramCity = req.params.city ? req.params.city.toLowerCase() : null;
    var paramState = req.params.state ? req.params.state.toLowerCase() : null;

    var {code, data} = await populationService.getPopulation(paramCity,paramState)

    if(code == CODE_ERROR_SYSTEM){
        return res.status(CODE_ERROR_SYSTEM).send({
            error: RESPONSE_MESSAGE[CODE_ERROR_SYSTEM]
        })
    }

    return res.status(CODE_SUCCESS_UPDATE).send({
        message:"Successfully Load",
        data:data
    });

}

module.exports = {
    create,
    get
}