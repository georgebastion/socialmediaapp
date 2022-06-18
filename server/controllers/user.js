import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

export const signin =async (req, res)=>{
    const {email, password} = req.body;
    try {
        const existingUser = await userModel.findOne({email});
        if(!existingUser) return res.status(404).json({message: "User does not exist"});
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) return res.json(400).json({message:"Invalid Credentials"});

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "1h"});
        res.status(200).json({result: existingUser, token})
    } catch (error) {
        res.status(500).json({message:'Something went Wrong'})
        
    }


}
export const signup =async(req, res)=>{
    const {firstname, lastname, email, password, confirmpassword} = req.body;
    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser) return res.status(400).json({message: "User already exist"});
        if (password !== confirmpassword) return res.json(400).json({message:"Password don't match"});
    
        const hashedPassword = await bcrypt.hash(password, 12);
    
        const result= await userModel.create({email, password:hashedPassword, name: `${firstname} ${lastname}`});
        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: "1h"});
    
        res.status(200).json({result, token})
    } catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
        
     
    
}