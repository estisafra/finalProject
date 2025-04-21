const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Modules/UserModule");
const Renter = require("../Modules/RenterModule");
const Photography = require("../Modules/PhotographyModule");
const { createUser } = require("../Controllers/UserController");
const { createPhotography } = require("../Controllers/PhotographyController");
const { createRenter} = require("../Controllers/RenterController");
async function login(req, res) {
    try {
        const { email, password} = req.body;
         userType=""
        if( User.findOne({userPassword:password,userMail:email})!=null)
            userType="User"
        else
        if( Renter.findOne({renterPassword:password,renterMail:email})!=null)
              userType="Renter"
          
        else
        if( Photography.findOne({PhotographyrPassword:password,PhotographyMail:email})!=null)
              userType="Photography"

        // בדוק אם סוג המשתמש סופק
        if (!userType || !["User", "Renter", "Photography"].includes(userType)) {
            return res.status(400).send("המשתמש לא קיים");
        }

        // מיפוי בין סוג המשתמש למודל ולשדה הסיסמה
        const userMapping = {
            User: { model: User, passwordField: "userPassword" },
            Renter: { model: Renter, passwordField: "renterPassword" },
            Photography: { model: Photography, passwordField: "photographyPassword" },
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
            { expiresIn: "99h" }            // תוקף ה-Token
        );

        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function register(req, res) {
    try {
        const { email, password, userType } = req.body;

        // לוגים לבדיקה
        console.log("Received data:", req.body); // בדוק את הנתונים שהתקבלו
        if (!email || !password || !userType) {
            console.error("Missing required fields:", { email, password, userType });
            return res.status(400).send("שדות חובה חסרים.");
        }

        let user;

        // יצירת המשתמש לפי סוג המשתמש
        switch (userType) {
            case "User":
                console.log("Creating User...");
                req.body.userPassword = password;
                req.body.userMail = email;
                req.body.userName=req.body.name;
                req.body.userPhone=req.body.phone;
                req.body.userAddress=req.body.address;
                user = await createUser(req, res);
                break;
            case "Photography":
                console.log("Creating Photography...");
                user = await createPhotography(req, res);
                break;
            case "Renter":
                console.log("Creating Renter...");
                user = await createRenter(req, res);
                break;
            default:
                console.error("Invalid userType:", userType);
                return res.status(400).send("סוג משתמש לא תקין.");
        }

        // אם אחת הפונקציות כבר שלחה תגובה, עצור כאן
        if (!user) {
            console.error("User creation failed.");
            return res.status(500).send("שגיאה ביצירת המשתמש.");
        }

        console.log("User created successfully:", user);

        // יצירת JWT Token
        const token = jwt.sign(
            { userId: user._id, userType },
            process.env.JWT_SECRET,
            { expiresIn: "99h" }
        );

        console.log("JWT Token created:", token);

        res.status(201).send({ message: "משתמש נוצר בהצלחה.", token });
    } catch (error) {
        console.error("Error during registration:", error); // לוג של השגיאה
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
module.exports = { login ,register, authenticateToken };