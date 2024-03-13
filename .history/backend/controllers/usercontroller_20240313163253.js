const User = require('../models/user');
const Text = require('../models/text');
const Recording = require('../models/recordings');

let registerUser = async (req, res) => {
    console.log("register controller called");
    User.findOne({ email: req.body.email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).send({ message: "User account with this email already exists!" });
            }
            
            let newUser = new User({
                name: req.body.name,
                email: req.body.email,
                count: 0,
                consent: req.body.consent
            });
            newUser.save()
                .then((savedUser) => { // Corrected here: Use savedUser which is the result of newUser.save()
                    res.status(200).send({
                        message: "User registered successfully!",
                        userId: savedUser._id,
                        count: savedUser.count,
                        name: savedUser.name,
                        email: savedUser.email
                    });
                })
                .catch((err) => {
                    res.status(500).send({ message: err.message }); // Use err.message to send error details
                });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message }); // Use err.message to send error details
        });
};


let revisitUser = async (req, res) => {
    console.log("revisit controller called");
    User.findOne
    ({email: req.query.email})
    .then((existingUser)=>{
        if(existingUser)
        {
            res.status(200).send({ message: "user found", userId: existingUser._id, count: existingUser.count,name: existingUser.name,email: existingUser.email});
        }
        else
        {
            res.status(400).send({message:"user not found"});
        }
    })
    .catch((err)=>{
        res.status(500).send({message:err});
    })
}
let getallrecsofuser = async (req, res) => {
    console.log("getallrecsofuser controller called");
    User.findById(req.query.userId)
        .populate('recordings') // Ensure you have a 'recordings' path in your User model
        .then(user => {
            if (user && user.recordings.length > 0) {
                // User and recordings found, send them back
                res.status(200).send(user.recordings);
            } else {
                // No recordings found for this user
                res.status(404).send({ message: "No recordings found for this user." });
            }
        })
        .catch(err => {
            console.error("Error fetching user or recordings:", err);
            res.status(500).send({ message: "Internal server error while fetching recordings." });
        });
};


module.exports = {
    registerUser,
    revisitUser,
    countplus,
    getallrecsofuser
};
