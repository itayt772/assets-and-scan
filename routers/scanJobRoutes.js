const express=require('express');
const router=express.Router();
const scanJobController=require('../controllers/scanJobController');


//enter minutes and assetId
router.route('/createScan').post(scanJobController.createScan);

module.exports=router;