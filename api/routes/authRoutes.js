// Import dependencies
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");

// Setup the express server router
const router = express.Router();

// On post
router.post("/", async (req, res) => {
    // Dummy data
    const users = [{ username: "microvision", password: "$2b$15$hainpV6yqlsBFgWXluCCUe5gLAX6O42i8on9tkeLSWvN0/tvNRolq", roles: ["admin", "editor", "viewer"] }];

    // Get to user from the database, if the user is not there return error
    let user = users.find(u => u.username === req.body.username);
    if (!user){
        return res.status(401).send({
            ok: false,
            error: "Invalid user or password."
        });
        //throw new Error("Invalid user or password.");
    }

    // Compare the password with the password in the database
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid){
        return res.status(401).send({
            ok: false,
            error: "Invalid user or password."
        });
       // throw new Error("Invalid user or password.");
    } 

    const token = jwt.sign({
        id: user._id,
        roles: user.roles,
    }, "jwtPrivateKey", { expiresIn: "120m" });

    res.send({
        ok: true,
        token: token
    });
});

// Export the router
module.exports = router;