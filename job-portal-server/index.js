const express = require('express')
const app = express()
const bcrypt = require("bcrypt");
const cors = require('cors')
const port = process.env.PORT || 5000;
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes')
const jobApplicationRoutes = require('./routes/jobApplicationRoutes');
require('dotenv').config()
const jwt = require("jsonwebtoken");

const multer = require("multer");
app.use(morgan('dev'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

//middleware
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoutes)
//app.use('/api/job-application', jobApplicationRoutes);



//mongodb
// user:mohnishkalaimani
// pass:mohnish123

const generateAccessToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '1h'});
}



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal.awqtstu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect({useNewUrlParser:true, connectTimeoutMS: 50000 });
    //create db
    const db = client.db("jobPortal");
    const jobsCollections = db.collection("jobs");
    const authCollection = db.collection("auth");
    const jobApplications = db.collection("jobapplications");

    app.post("/signup", async (req, res) => {
      try {
        const { email, password, firstName, lastName } = req.body;
        console.log(password);
        const existingUser = await authCollection.findOne({ email });
        
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Will Create");
        const newUser = await authCollection.insertOne({ email, password: hashedPassword, firstName, lastName });
        console.log("Created");
        const accessToken = generateAccessToken(newUser._id);
        res.status(201).json({ accessToken, message: "User created successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create User" });
      }
    })

    


    // app.post("/normal_signup", upload.single('profileImage'), async (req, res) => {
    //   try {

    //     const { email, password, firstName, lastName } = req.body;

    //     const profileImage = req.file;
  

    //     if (!profileImage) {
    //         return res.status(400).send("No file Uploaded");
    //     }
  
    //     const profileImagePath = profileImage.path;
  
    //     const existingUser = await authCollection.findOne({ email });
  
    //     if (existingUser) {
    //         return res.status(400).json({ message: "User already exists" });
    //     }
  
    //     const hashedPassword = await bcrypt.hash(password, 10); // Use bcrypt.hash to hash the password
  
    //     authCollection.insertOne({
    //         firstName,
    //         lastName,
    //         email,
    //         password: hashedPassword,
    //         profileImagePath,
    //     })
    //     .then(result => {
    //       const accessToken = generateAccessToken(newUser._id);
    //       res.status(201).json({ accessToken, message: "User created success" });
    //       console.log('User inserted:', result.insertedId);
    //       res.json({ message: 'User inserted successfully' });
    //     })
  
        

    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: "Failed to create User" });
    // }
    // })

    app.post("/normal_signup", upload.single('profileImage'), async (req, res) => {
      try {
          const { email, password, firstName, lastName } = req.body;
          const profileImage = req.file;
  
          if (!profileImage) {
              return res.status(400).send("No file uploaded");
          }
  
          const profileImagePath = profileImage.path;
  
          const existingUser = await authCollection.findOne({ email });
  
          if (existingUser) {
              return res.status(400).json({ message: "User already exists" });
          }
  
          const hashedPassword = await bcrypt.hash(password, 10);
  
          const newUser = {
              firstName,
              lastName,
              email,
              password: hashedPassword,
              profileImagePath,
          };
  
          authCollection.insertOne(newUser)
              .then(result => {
                  const accessToken = generateAccessToken(result.insertedId);
                  res.status(201).json({ accessToken, message: "User created successfully" });
                  console.log('User inserted:', result.insertedId);
              })
              .catch(error => {
                  console.error(error);
                  res.status(500).json({ message: "Failed to create user" });
              });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Failed to create user" });
      }
  });
  


app.post("/normal_login", async (req, res) => {

  try {
    const { email, password } = req.body;
    const user = await authCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass) {
      return res.status(401).json({ message: "Invalid pass" });
    }
    const accessToken = generateAccessToken(user._id);

    res.status(200).json({ accessToken, user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login" });
  }

})
    

    

    // login
    app.post("/login", async(req, res) =>{
      try {
        const { email, password } = req.body;
        const user = await authCollection.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "Invalid Credentials" });
        }
        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
          return res.status(401).json({ message: "Invalid pass" });
        }
        const accessToken = generateAccessToken(user._id);
    
        res.status(200).json({ accessToken });
      } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Failed to login" });
      }
    })


    // post a job
    app.post("/post-job", async(req, res) =>{
        const body = req.body;
        body.createAt = new Date();
        // console.log(body)
        const result = await jobsCollections.insertOne(body);
        if(result.insertedId){
            return res.status(200).send(result);
        }
        else{
            return res.status(200).send({
                message: "cannot insert! try again later",
                status: false
            });
        }
    })

  // noel 

    //get all jobs
    app.get("/all-jobs" ,  async(req, res) =>{
       console.log("Index.js");
        const jobs = await jobsCollections.find({}).toArray({})
        res.send(jobs);
    })

    //get single job using id
    app.get("/all-jobs/:id", async(req, res) => {
      const id = req.params.id;
      const job = await jobsCollections.findOne({
        _id: new ObjectId(id)
      })
      res.send(job)
    })


    // get jobs by email
    app.get("/myJobs/:email" , async(req,res) => {
      // console.log(req.params.email)
      const jobs = await jobsCollections.find({postedBy : req.params.email}).toArray();
      res.send(jobs)
    })

    //delete a job
    app.delete("/job/:id", async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await jobsCollections.deleteOne(filter)
      res.send(result)
    })


    app.post("/submit-application" , async (req, res) => {
      try {
        const { firstName, lastName, email, phone, dateAvailable, desiredPay, experienceOSGI, jobId } = req.body;
        const resume = req.file;
        console.log(req.body)
    
        const newApplication = await jobApplications.insertOne({
          firstName,
          lastName,
          email,
          phone,
          jobId,
          dateAvailable,
          desiredPay,
          experienceOSGI,
        });
    
        console.log(newApplication);
    
    
    
        res.status(201).json({ message: 'Job application submitted successfully' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }
    })

    
    app.post("/applications_for_job", async (req, res) => {

      try {
        const { id } = req.body;

        console.log(id);
    
        const allApplications = await jobApplications.find({jobId: id}).toArray();
    
       
    
        res.status(201).json({ data: allApplications });

      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      }



    })



    //update a job
    app.patch("/update-job/:id", async(req,res) => {
      const id = req.params.id;
      const jobData = req.body;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert:true};
      const updateDoc ={
        $set: {
          ...jobData
        },
      };

      const result = await jobsCollections.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Developer!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jobRoutes = require('./routes/jobRoutes');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(express.json());
// app.use(cors());

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log("Connected to MongoDB");
// });

// app.use('/api', jobRoutes);
// app.use('/api/auth', authRoutes)

// app.get('/', (req, res) => {
//   res.send('Hello Developer!')
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// });

