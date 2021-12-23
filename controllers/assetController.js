const Asset = require("../models/assetModel");
const { catchAsync } = require("../errorHandler");
const scanJodController = require("./scanJobController");

/**
 * General notes:
 * - Move logic from controller to servies.
 * - Always prefer using "const" over "let" if you can.
 */

module.exports.createAsset = catchAsync(async (req, res, next) => {
  // move logic to service (assetService.create())
  let newAsset = await Asset.create(req.body);
  // Use interface for response model ({ status: 'success' | 'fail', data<T>}) for example
  res.status(201).json({
    status: "success",
    newDoc: newAsset,
  });
});

module.exports.getAll = catchAsync(async (req, res, next) => {
  let perPage = req.query.perPage * 1 || 5;
  let page = req.query.page * 1 || 1;

  let assets = await Asset.find()
    .skip(perPage * page - perPage)
    .limit(perPage);

  if (req.query.page) {
    // In mongo you can use $facet for example to get assets and counts for pagination in one query to mongo.
    // Return error in that case is useless, you can just return empty array
    const documentsNum = await Asset.countDocuments();
    if (perPage * page - perPage >= documentsNum) {
      throw new Error("This page doesnt exist");
    }
  }

  // Using pagniation you will have to return the total count number so client side can implement pagination based on this info.
  res.status(200).json({
    status: "success",
    assets,
  });
});

module.exports.getAssetById = catchAsync(async (req, res, next) => {
  let asset = await Asset.findById(req.params.id);
  let scans = await scanJodController.findScanJobsByAssetId(req.params.id);
  res.status(200).json({
    status: "success",
    asset,
    scans,
  });
});

/**
 * - getAssetsByName - and you can remove this function:
 * - You already implement pagination in 'getAll' - what if we use this function and have many assets?
 * - You should use 'getAll' with filters and then implement pagination
 */
module.exports.getAssetByName = catchAsync(async (req, res, next) => {
  let assets = await Asset.find({ name: req.query.name });
  res.status(200).json({
    status: "success",
    assets,
  });
});
