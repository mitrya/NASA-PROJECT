const { getAllLaunches,addNewLaunches,existsLaunchWithId, abortLaunchById } = require("../../models/launches.model");

function httpGetAllLaunches(req,res){
    return res.status(200).json(getAllLaunches());
}
function httpAddNewLaunches(req,res){
    let launch = req.body

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target ){
        return res.status(400).json({
            error:"Missing required launch property",
        });
    }
    launch.launchDate = new Date(launch.launchDate);

    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error:"Inavalid launch date",
        });
    }
    addNewLaunches(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id);
    
    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
          error: 'Launch not found',
        });
      }
    

    const aborted = abortLaunchById(launchId);
    console.log(aborted)
    return res.status(200).json(aborted);
}
module.exports={
    httpGetAllLaunches,
    httpAddNewLaunches,
    httpAbortLaunch
}