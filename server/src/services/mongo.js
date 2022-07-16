const mongoose=require('mongoose');


const MONGO_URL='mongodb+srv://NASA-api:HVP1Vneaf3le1ldS@nasacluster.lqrhbev.mongodb.net/?retryWrites=true&w=majority'


mongoose.connection.once('open',()=>{
    console.log('MongoDB connect ready!');
});

mongoose.connection.on('error',(err)=>{
    console.error(err);
})

async function mongoConnect()
{
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect()
{
    await mongoose.disconnect();
}

module.exports={
    mongoConnect,
    mongoDisconnect
}