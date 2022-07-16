const fs = require('fs')
const path = require('path')

const { parse } = require("csv-parse");

const planets = require('./planets.mongo')



function isHabitable(planet){
    return      planet['koi_disposition'] === 'CONFIRMED'
            &&  planet['koi_insol'] > 0.36
            &&  planet['koi_insol'] < 1.11
            &&  planet['koi_prad']  < 1.6;
}
function loadPlanetsData()
{
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
        .pipe(parse({
            comment:'#',
            columns:true
        }))
        .on('data', async (data)=>{
            if(isHabitable(data))
            {
                await savePlanet(data)
            }
        })
        .on('error',(error)=>{
            console.log(error)
            reject(error);
        })
        .on('end',async ()=>{
            const countPlanetsFound = (await getAllPlanets()).length;
          //  console.log(await getAllPlanets())
            console.log(`habitable planets : ${countPlanetsFound}`)
            resolve();
        })            
    })

}

async function getAllPlanets()
{
    return await planets.find({});
} 

async function savePlanet(planet)
{
    try{
        await planets.updateOne({
            keplerName:planet.kepler_name
        },{
            keplerName:planet.kepler_name
        },{
            upsert:true
        });    
    }
    catch(err)
    {
        console.error(err);
    }

}

module.exports={
    loadPlanetsData,
    getAllPlanets 
};