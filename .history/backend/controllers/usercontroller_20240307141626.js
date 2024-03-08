const User = require('../models/user');
const Text = require('../models/text');
const Recording = require('../models/recordings');

let registerUser = async (req, res) => {
    console.log("register controller called");

    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).send({ message: "User account with this email already exists!" });
        }

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            count: 0,
            consent: req.body.consent
        });

        await newUser.save();

        res.status(200).send({ message: "User registered successfully!" });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send({ message: "Error registering the user." });
    }
};


let revisitUser = async (req, res) => {
    console.log("revisit controller called");
    User.findOne
    ({email: req.body.email})
    .then((existingUser)=>{
        if(existingUser)
        {
            res.status(200).send({message:"user found"});
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
    revisitUser
};