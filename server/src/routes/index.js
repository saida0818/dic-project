const express = require('express') 
const router = express.Router() 
const dic = require('./dic') 

router.use('/dics', dic) 

module.exports = router
