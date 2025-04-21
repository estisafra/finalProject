const _ = require('lodash');

const User=require('../Modules/UserModule')
const bcrypt = require("bcryptjs");

 async function createUser(req, res) {
            try {
                const user = new User(req.body);
        
                // הצפנת הסיסמה
                const hashedPassword = await bcrypt.hash(user.userPassword, 10);
                user.userPassword = hashedPassword;
        
                // שמירת המשתמש במסד הנתונים
                await user.save();
        
                // החזרת המשתמש שנוצר
                return user;
            } catch (error) {
                // החזרת שגיאה אם יש בעיה
                throw new Error(error.message);
            }
        }



async function getUserById(req, res)  {
    try {
        const {_id} = req.params;
        let user = await User.findById(_id);
        if (!user) {
           res.status(404).send(null);
        }
        else res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function getAllUsers(req, res)  {
    try {
        let user = await User.find();
         res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function updateUserDetails(req, res)  {
    try {
        let { _id } = req.params;
        let user = await User.findById(_id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        _.assign(user, req.body);
        let updated = await user.save();
        res.status(200).send(updated);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function deleteUser(req, res)  {
    try {
        let { _id } = req.params
        let user =await User.findByIdAndDelete(_id)
        if (!user) {
            res.status(404).send('User not found');
         }
         else res.status(204).send()
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports= {getUserById,createUser,updateUserDetails,deleteUser,getAllUsers}

