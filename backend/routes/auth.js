const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = "DevisAwesome@";
var fetchuser=require('../middleware/fetchUser');

//Route 1 create a user using Post "/api/auth/createuser" No login required
router.post('/createuser', [
    body('email', "Enter valid Email").isEmail(),
    body('name', "Enter valid name").isLength({ min: 3 }),
    body('password', "Password must have atleast 5 characters").isLength({ min: 5 })
], async (req, res) => {
    let success=false;

    //If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    //Check whether the user with this email exists already

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "sorry a user with this email exists already" });
        }
        const salt = await bcrypt.genSalt(10);

        secPass = await bcrypt.hash(req.body.password, salt);
        //creating user    
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(jwtData);
        success=true;
        res.json({success, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
})

//Route 2 Authenticate a user using: Post "/api/auth/login". No login required
router.post('/login', [
    body('email', "Enter valid Email").isEmail(),
    body('password', "Password must have atleast 5 characters").isLength({ min: 5 })
], async (req, res) => {

    //If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    success=false;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Enter correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Enter correct credentials" });
        }
        const payload = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        // console.log(jwtData);
        success=true;
        res.json({authToken: authToken,success:success });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }

});


//Route 3 : Get loggedin user details
router.post('/getuser',fetchuser, async (req, res) => {

try {
    userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
}});


module.exports = router;