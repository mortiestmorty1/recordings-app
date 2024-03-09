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
                .then(() => {
                    res.status(200).send({ message: "User registered successfully!", userId: savedUser._id, count: savedUser.count, name: savedUser.name});
                })
                .catch((err) => {
                    res.status(500).send({ message: err });
                });
        })
        .catch((err) => {
            res.status(500).send({ message: err });
        });
};

let revisitUser = async (req, res) => {
    console.log("revisit controller called");
    User.findOne
    ({email: req.query.email})
    .then((existingUser)=>{
        if(existingUser)
        {
            res.status(200).send({ message: "user found", userId: existingUser._id, count: existingUser.count,name: existingUser.name});
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
let countplus = async (req, res) => {
    console.log("countplus controller called");
    User.findOne
    ({email: req.query.email})
    .then((existingUser)=>{
        if(existingUser)
        {
            User.findByIdAndUpdate(
                existingUser._id, 
                {
                    $inc: { count: 1 } // Atomically increment the count
                },
                { new: true }
            );
            res.status(200).send({ message: "count incremented"});
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

module.exports = {
    registerUser,
    revisitUser,
    countplus
};
