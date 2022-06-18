const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

router.post('/signup', 
    body("name", "Enter a valid name").isLength({min: 3}),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a strong password").isLength({min: 5}),
    async(req, res) => {
        const errors = validationResult(req);
        let success = false;
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        try {
            let user = await User.findOne({email: req.body.email});
            if(user) 
            {
                success = false
                return res.status(400).json({success, error: "Sorry this email already exists!!"})
            }
            const salt = await bcrypt.genSalt(10);
            const secretPass = await bcrypt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secretPass,
                picture: req.body.picture
            })

            // const data = {
            //     user: {
            //         id: user.id
            //     }
            // }
            // const authToken = jwt.sign(data, "onepieceisreal");
            success = true
            res.json(user);
        } catch (error) {
             res.status(400).send("som error occurred!!");
        }
    }
)

router.post('/login',
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a strong password").exists(),
    async(req, res) => {
        const errors = validationResult(req);
        let success = false;
        if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        const { email, password } = req.body;
        try {
            const user = await User.findOne({email});
            if(!user) {
                success = false;
                res.status.send("Enter valid credentials");
            }
            const passCompare = await bcrypt.compare(password, user.password);
            if(!passCompare) {
                success = false;
                res.status.send("Enter valid credentials"); 
            }
            // const data = {
            //     user: {
            //         id: user.id
            //     }
            // }
            // const authToken = jwt.sign(data, 'onepieceisreal');
            success = true;
            user.status = 'online';
            await user.save();
            res.json(user);
        } catch (error) {
            res.status(400).send("Some error occured");
        }  
    }
)

module.exports = router;