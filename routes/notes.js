const express = require('express')
const router = express.Router();


router.get('/', (req, res)=>{
    response = {}
    res.json(response)
})

module.exports = router