const express = require("express");
const router = express.Router();

const Certificate = require("../models/Certificate");

router.get("/:id", async (req,res)=>{
  try{

    const cert = await Certificate.findOne({
      certificateId: req.params.id
    });

    if(!cert){
      return res.status(404).json({message:"Not found"});
    }

    res.json(cert);

  }catch(error){
    res.status(500).json({message:"Server error"});
  }
});

module.exports = router;