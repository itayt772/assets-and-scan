const mongoose = require('mongoose');
const ScanJob = require('../models/scanJobModel');
const Queue = require('bull');
const {catchAsync}=require('../errorHandler');

const jobQueue = new Queue('jobScanQueue', 'redis://127.0.0.1:6379')


module.exports.createScan = catchAsync(async (req, res,next) => {

    let currDate = new Date();
    let scanDueDate = new Date(currDate.getTime() + req.body.minutes * 60000);

    let newScan = await ScanJob.create({
        status: req.body.status,
        scanDueDate,
        asset: req.body.asset
    });

    await jobQueue.add({ scanId: newScan._id }, { delay: req.body.minutes * 60000 });

    res.status(201).json({
        status: 'success',
        newDoc: newScan
    })
});

module.exports.findScanJobsByAssetId = async function (id) {
    return await ScanJob.find({ "asset": mongoose.Types.ObjectId(id) });
    
}

jobQueue.on('completed',async function(job){
    await ScanJob.findByIdAndUpdate(
        { _id: job.data.scanId },
        { status: "succeeded", dateCompleted: new Date()});
})

jobQueue.on('failed',async function(job){
    await ScanJob.findByIdAndUpdate(
        { _id: job.data.scanId },
        { status: "failed", dateCompleted: new Date() });
})
 
jobQueue.process(function(){
    console.log('job running')
})