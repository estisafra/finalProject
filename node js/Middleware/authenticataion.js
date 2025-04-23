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
         user = await User.findOne({ userMail: email });
         if (user) {
             const match = await bcrypt.compare(password, user.userPassword);
             if (match) {
                 userType = "User";
             } else {
                 return res.status(300).json({ status: 'error', message:"סיסמה שגויה"  });
             }
         }
         
         // חיפוש משתמש מסוג Renter אם לא נמצא
         if (!userType) {
             user = await Renter.findOne({ renterMail: email });
             if (user) {
                 const match = await bcrypt.compare(password, user.renterPassword);
                 if (match) {
                     userType = "Renter";
                 } else {
                     return res.status(300).json({ status: 'error', message: "סיסמה שגויה" });
                 }
             }
         }
         
         // חיפוש משתמש מסוג Photography אם לא נמצא
         if (!userType) {
             user = await Photography.findOne({ PhotographyMail: email });
             if (user) {
                 const match = await bcrypt.compare(password, user.photographyPassword);
                 if (match) {
                     userType = "Photography";
                 } else {
                     return res.status(300).json({ status: 'error', message: "סיסמה שגויה"  });
                 }
             }
         }
         
        // בדוק אם סוג המשתמש סופק
        if (!userType || !["User", "Renter", "Photography"].includes(userType)) {
            return res.status(400).send("המשתמש לא קיים");
        }

        // מיפוי בין סוג המשתמש למודל ולשדה הסיסמה
        const userMapping = {
            User: { model: User, passwordField: "userPassword" ,emailField:"userMail"},
            Renter: { model: Renter, passwordField: "renterPassword" ,emailField:"renterMail"},
            Photography: { model: Photography, passwordField: "photographyPassword" ,emailField:"photographyMail"},
        };

        // קבל את המודל ושם השדה המתאים
        const { model: Model, passwordField ,emailField} = userMapping[userType];
        console.log(Model, passwordField);
        // מצא את המשתמש לפי אימייל
        user = await Model.findOne({ [emailField]: email });
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

        res.status(200).send({ token,user,role:userType });
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
                    const images = req.files.map((file) => ({
                        url: `/uploads/${file.filename}`,
                        gallery: req.body.galeries.find((gallery) => gallery.name === file.gallery)?.name || "Unknown",
                    }))
                    console.log("Creating Photography...");
                    req.body.photographyPassword = password;
                    req.body.photographyMail = email;
                    req.body.photographyName = req.body.name;
                    req.body.photographyPhone = req.body.phone;
                    req.body.photographyAddress = req.body.address;
                    
                    // הוספת השדות החדשים
                    req.body.photographyLink = req.body.link;
                    req.body.photographyImages = req.body.images; // מערך של תמונות
                    req.body.photographyGaleries = req.body.galeries; // מערך של גלריות
                    req.body.photographyResponse = req.body.response; // מערך של תגובות
                
                    user = await createPhotography(req, res);
                    break;
                
            case "Renter":
                console.log("Creating Renter...");
                req.body.renterPassword = password;
                req.body.renterMail = email;
                req.body.renterName=req.body.name;
                req.body.renterPhone=req.body.phone;
                req.body.renterAddress=req.body.address;
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

        res.status(201).send({ message: "משתמש נוצר בהצלחה.", token ,user});
    } catch (error) {
        console.error("Error during registration:", error); // לוג של השגיאה
        res.status(500).send(error.message);
    }
}
function verifyToken(req, res, next) {
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
module.exports = { login ,register, verifyToken };