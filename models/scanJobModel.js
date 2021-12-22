const mongoose=require('mongoose');

let scanJobSchema=new mongoose.Schema({
    dateCompleted:{
        type:Date,
        default:null
    },
    status:{
        type:String,
        enum:['pending','succeeded','failed'],
        default:"pending"
    },
    scanDueDate:Date,
    asset:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Asset',
        required:true
    }   
},
{
    timestamps: true
});

const model=mongoose.model("scanJob",scanJobSchema);

module.exports=model;