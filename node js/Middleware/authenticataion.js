const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Modules/UserModule");
const Renter = require("../Modules/RenterModule");
const Photographer = require("../Modules/PhotographyModule");

async function login(req, res) {
    try {
        const { email, password, userType } = req.body;

        // בדוק אם סוג המשתמש סופק
        if (!userType || !["user", "renter", "photographer"].includes(userType)) {
            return res.status(400).send("סוג משתמש לא תקין.");
        }

        // מיפוי בין סוג המשתמש למודל ולשדה הסיסמה
        const userMapping = {
            user: { model: User, passwordField: "userPassword" },
            renter: { model: Renter, passwordField: "renterPassword" },
            photography: { model: Photographer, passwordField: "photographyPassword" },
        };

        // קבל את המודל ושם השדה המתאים
        const { model: Model, passwordField } = userMapping[userType];
        console.log(Model, passwordField);
        // מצא את המשתמש לפי אימייל
        const user = await Model.findOne({ userMail: email });
        if (!user) {
            return res.status(404).send("משתמש לא נמצא.");
        }

        // בדוק אם הסיסמה נכונה
        const isPasswordValid = await bcrypt.compare(password, user[passwordField]);
        if (!isPasswordValid) {
            return res.status(401).send("סיסמה שגויה.");
        }

        // צור JWT Token
        const token = jwt.sign(
            { userId: user._id, userType }, // מידע שיכנס ל-Token
            process.env.JWT_SECRET,        // מפתח סודי
            { expiresIn: "1h" }            // תוקף ה-Token
        );

        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send("גישה נדחתה. אין Token.");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Token לא תקין.");
        }

        req.user = user; // שמור את המידע מה-Token בבקשה
        next();
    });
}
module.exports = { login , authenticateToken };