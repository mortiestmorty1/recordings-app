const Text = require('../models/text');
const Recording = require('../models/recordings');
const User = require('../models/user');


let addText = async (req, res) => {
    console.log("add text controller called");
    Text.findOne({id: req.body.id})
    .then((existingText)=>{
        if(existingText)
        {
            return res.status(400).send({message:"text with this id already exists!"});
        }
        let newText = new Text({
            id: req.body.id,
            text: req.body.text,
            count: 0
        })
        newText.save()
        .then(()=>{
            res.status(200).send({message:"text added successfully!"});
        })
        .catch((err)=>{
            res.status(500).send({message:err});
        })
    }
    )
    .catch((err)=>{
        res.status(500).send({message:err});
    })
}

let getText = async (req, res) => {
    console.log("get text controller called");
    Text.findOne
    ({id: req.body.id})
    .then((existingText)=>{
        if(existingText)
        {
            res.status(200).send({message:existingText});
        }
        else
        {
            res.status(400).send({message:"text not found"});
        }
    })
    .catch((err)=>{
        res.status(500).send({message:err});
    })
}

let deleteText = async (req, res) => {
    console.log("delete text controller called");
    Text.findOneAndDelete
    ({id: req.body.id})
    .then((existingText)=>{
        if(existingText)
        {
            res.status(200).send({message:"text deleted"});
        }
        else
        {
            res.status(400).send({message:"text not found"});
        }
    })
    .catch((err)=>{
        res.status(500).send({message:err});
    })
}

let updateText = async (req, res) => {
    console.log("update text controller called");
    Text.findOneAndUpdate
    ({id: req.body.id}, {text: req.body.text})
    .then((existingText)=>{
        if(existingText)
        {
            res.status(200).send({message:"text updated"});
        }
        else
        {
            res.status(400).send({message:"text not found"});
        }
    })
    .catch((err)=>{
        res.status(500).send({message:err});
    })
}
module.exports = {
    addText,
    getText,
    deleteText,
    updateText
};