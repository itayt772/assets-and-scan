const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');


//query the page number and the limit(optional)
router.route('/getAll').get(assetController.getAll);

router.route('/createAsset').post(assetController.createAsset);
router.route('/getAssetById/:id').get(assetController.getAssetById);
router.route('/getAssetByName').get(assetController.getAssetByName);

module.exports = router;
