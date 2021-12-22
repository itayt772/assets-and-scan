const mongoose=require('mongoose');
const validator=require('node-mongoose-validator');

let assetSchema=new mongoose.Schema({
    ip:{
        type:String,
        required:[true,'you must provide ip to the asset'],
        validate: validator.$isIP({msg:'please provide valid ip'})
    },
    name:{
        type:String,
        required:[true,'you must provide name to the asset']
    },
    description:String
},
{
    timestamps: true
});

const model=mongoose.model("Asset",assetSchema);

module.exports=model;
