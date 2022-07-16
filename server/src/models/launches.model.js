const launchesDB = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER=100;

async function getAllLaunches()
{
    return await launchesDB.find({},{
        '_id':0,
        '__v':0
    });
}
async function saveLaunch(launch)
{
    const planet = await planets.find({
        keplerName:launch.target,
    });
    // console.log(planet)
    if(planet==false)
    {
       throw new Error('no matching planet found');
    }
    await launchesDB.findOneAndUpdate({
        flightNumber:launch.flightNumber,
    },launch,{
        upsert:true
    }
    )
}

async function getLatestFlightNumber()
{
    const latestLaunch=await launchesDB
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch)
    {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}


async function scheduleNewLaunch(launch)
{
    const newLatestFlightNumber = await getLatestFlightNumber()+1;
    const newLaunch = Object.assign(launch,
        {
                flightNumber: newLatestFlightNumber,
                customers: ['ZTM', 'NASA'],
                upcoming: true,
                success: true

        })
    await saveLaunch(newLaunch);
}



async function existsLaunchWithId(launchId){
    return await launchesDB.findOne({
        flightNumber:launchId,
    }) 
}

async function abortLaunchById(launchId){
  
    const aborted=  await launchesDB.updateOne({
        flightNumber:launchId,
    },{
        upcoming:false,
        success:false,  
    });

    return aborted.matchedCount===1;
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
};