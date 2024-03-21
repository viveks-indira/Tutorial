const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose"); 

const app = express();
const PORT = 5000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//DbConnection
mongoose.connect("mongodb://127.0.0.1:27017/employee")
.then(()=>{ console.log("Db Connected")})
.catch((err)=>{
    console.log("Error ",err)
});


//Schema
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String, 
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    gender:{
        type:String, 
    }
},
   { timestamps:true }
);

const User=mongoose.model("user",userSchema);

app.get("/", (req, res) => {
  return res.send("Home Page");
});

app.get("/api/users", async (req, res) => {
    const allUser=await User.find({});
  //  console.log("result : ",allUser);
  return res.status(202).send({allUser}).json({msg:"Accepted"});
});

app.get("/api/user/:id", async(req, res) => {
    const uId = req.params.id;
    try {
        const user = await User.findById(uId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Convert the user object to a plain JavaScript object without circular references
        const userJSON = user.toObject();

        console.log(userJSON);
        return res.json(userJSON);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/user", async (req, res) => {
    const body=req.body;
    if(!body ||!body.firstName || !body.lastName || !body.email || !body.gender || !body.gender){
        return res.status(400).json({msg:"All field are required "})
    }
    const result = await User.create({
        firstName:body.firstName,
        lastName:body.lastName,
        email:body.email,
        gender:body.gender
    })
    console.log("result : ",result);
  return res.status(201).json({msg:"success"});
});

app.delete("/api/user/:id", async(req, res) => {
  const userId = req.params.id;
  await User.findByIdAndDelete(userId);
  return res.json({msg:"Deleted Succesfully"});
});

app.put("/api/user/:id", (req, res) => {
    // const userId = req.params.id; // Use params to get the user id from the URL
    // const toBeUpdatedIndex = users.findIndex((user) => user.id === parseInt(userId));

    // if (toBeUpdatedIndex === -1) {
    //     return res.status(404).send("User not found");
    // }
    // const updatedUserData = req.body;

    // users[toBeUpdatedIndex] = { ...users[toBeUpdatedIndex], ...updatedUserData };

    // fs.writeFile("MOCK_DATA.json", JSON.stringify(users), (err) => {
    //     if (err) {
    //         console.error("Error writing file:", err);
    //         return res.status(500).send("Error writing user data to file");
    //     }
    //     console.log("User Updated successfully");
    //     return res.send("User Updated successfully");
    // });
});
app.listen(PORT, () => console.log(`Server is live : ${PORT}`));
