const Asset = require('../models/assetModel');
const {catchAsync}=require('../errorHandler');
const scanJodController = require('./scanJobController');

module.exports.createAsset = catchAsync(async (req, res,next) => {

    let newAsset = await Asset.create(req.body);
    res.status(201).json({
        status: 'success',
        newDoc: newAsset
    })

});


module.exports.getAll = catchAsync(async (req, res,next) => {

    let perPage = req.query.perPage * 1 || 5;
    let page = req.query.page * 1 || 1;

    let assets = await Asset.find().skip(perPage * page - perPage).limit(perPage);

    if (req.query.page) {
        const documentsNum = await Asset.countDocuments();
        if (perPage * page - perPage >= documentsNum){
            throw new Error('This page doesnt exist')
        }
    }

    res.status(200).json({
        status: 'success',
        assets
    })
});

module.exports.getAssetById = catchAsync(async (req, res,next) => {

    let asset = await Asset.findById(req.params.id);
    let scans = await scanJodController.findScanJobsByAssetId(req.params.id);
    res.status(200).json({
        status: 'success',
        asset,
        scans
    })
});

module.exports.getAssetByName = catchAsync(async (req, res,next) => {

    let assets = await Asset.find({ "name": req.query.name });
    res.status(200).json({
        status: 'success',
        assets
    })
});
