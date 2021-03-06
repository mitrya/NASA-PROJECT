const request = require('supertest')
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API',()=>{


    beforeAll(async ()=>{
        await mongoConnect();
    })

    afterAll(async ()=>{
        await mongoDisconnect();
    })

    describe('Test GET /launches',()=>{
        test('It should respond with 200 success', async () => { 
            const response = await request(app)
            .get('/launches')
            .expect('Content-Type',/json/)
            .expect(200)
         });
    });
    
    describe('Test POST /launches',()=>{
      const completeLaunchData={
            "mission": "Kepler Expo12",
            "rocket": "Explorer IS23",
            "launchDate": "March 30, 2031",
            "target": "Kepler-1410 b"
        }
       const LaunchDataWithoutDate={
        "mission": "Kepler Expo12",
        "rocket": "Explorer IS23",
        "target": "Kepler-1410 b"
        }
        const LaunchDataWithInvalidDate={
            "mission": "Kepler Expo12",
            "rocket": "Explorer IS23",
            "launchDate": "Marchieufhhoie",
            "target": "Kepler-1410 b"
        }
        test('It should respond with 201 created',async () => { 
            const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type',/json/)
            .expect(201);
            
            const requestDate = new Date(completeLaunchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate)
            expect(response.body).toMatchObject(LaunchDataWithoutDate);
         });
    
         test('It should catch missing required properties',async () => {
            const response = await request(app)
            .post('/launches')
            .send(LaunchDataWithoutDate)
            .expect('Content-Type',/json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error:'Missing required launch property',
            });
          });
    
          test('It should catch each invalid dates',async () => {
            const response = await request(app)
            .post('/launches')
            .send(LaunchDataWithInvalidDate)
            .expect('Content-Type',/json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error:'Invalid launch date',
            });
          });
    
    });
        
})

