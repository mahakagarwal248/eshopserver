const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const auth = require("../middleware/authorization");
const Profile = require("../models/Profile");
const Product = require("../models/products");
const User = require("../models/User");

router.get("/:id", async (req, res)=>{
    try {
        const profile = await Profile.findOne({userId: req.params.id});
        console.log(profile);
        if(!profile){
            return res.status(400).json({msg: "There is no such profile"});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post("/", [
    auth, 
    [check("address", "Address is required").not().isEmpty()],
    [check("bio", "Bio is required").not().isEmpty()
    ],
], async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        website, 
        address, 
        bio, 
        facebook, 
        twitter, 
        instagram, 
        youtube, 
        linkedin
    } = req.body;
    const profileData = {};
    profileData.userId = req.user.id;
    if(website) profileData.website = website;
    if(address) profileData.address = address;
    if(bio) profileData.bio = bio;

    //put social media links into an object
    profileData.socialMedia = {};
    if(facebook) profileData.socialMedia.facebook = facebook;
    if(instagram) profileData.socialMedia.instagram = instagram;
    if(twitter) profileData.socialMedia.twitter = twitter;
    if(youtube) profileData.socialMedia.youtube = youtube;
    if(linkedin) profileData.socialMedia.linkedin = linkedin;

    try {
        let profile =await Profile.findOne({userId: req.user.id});
        if(profile){
            profile = await Profile.findOneAndUpdate(
                {userId: req.user.id}, 
                {$set:profileData}, 
                {new:true}
            );
            return res.json(profile);
        }
        profile = new Profile(profileData);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(400).send("Server Error");
    }
});
router.delete("/", auth, async (req, res)=>{
    try {
        const products = await Product.find({userId: req.user.id});
        products.forEach(async (products) =>{
            await Product.findByIdAndRemove({userId : req.user.id});
        });
        await Product.findOneAndRemove({userId: req.user.id});
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: "User details completely deleted"});
    } catch (err) {
        console.error(err.message);
        res.status(400).send("Server Error");
    }
})
module.exports = router;