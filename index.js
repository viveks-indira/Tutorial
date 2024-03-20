const express = require('express');
const  bodyParser = require('body-parser');

const users = require('./MOCK_DATA.json');
const fs=require("fs");
const app = express();
const PORT = 6000;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));



app.get("/", (req, res) => { 
  return res.send("Home Page");
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/user/:id", (req, res) => { 
    const id=Number(req.params.id); 
    const user=users.find((user)=>user.id===id);
    if (user) {
        console.log(user);
        return res.json(user);
    } else {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
    }
}); 

app.post("/api/user", (req, res) => {
    const newUser = req.body;
    const len = users.length + 1;
    newUser.id = len; // Assign new ID
    users.push(newUser); // Add new user to array 
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error writing user data to file');
        }
        console.log('User added successfully');
        return res.send('User added successfully');
    });
});

app.delete("/api/user/:id", (req, res) => {
    const userId = req.body.id;
    const toBeDeletedUser =users.findIndex((user)=>{user.id===userId});
    users.splice(toBeDeletedUser,1);
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error writing user data to file');
        }
        console.log('User Deleted successfully');
        return res.send('User Deleted successfully');
    });
});
  
app.listen(PORT, () => console.log(`Server is live : ${PORT}`));
