const User = require("../models/User");

// REGISTER USER
exports.registerUser = async (req,res)=>{
  try{
    const {name,email,password} = req.body;

    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    res.status(201).json({message:"User registered successfully"});

  }catch(error){
    res.status(500).json({message:"Server error"});
  }
};


// LOGIN USER
exports.loginUser = async (req,res)=>{

  const {email,password} = req.body;

  const user = await User.findOne({email});

  if(!user){
    return res.status(400).json({message:"User not found"});
  }

  if(user.password !== password){
    return res.status(400).json({message:"Invalid password"});
  }

  res.json({message:"Login successful"});
};