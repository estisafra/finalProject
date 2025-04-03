

const nodemailer = require("nodemailer");
const Rent = require("../Modules/RentModule");

async function sendEmails() {
    const subject = "Reminder: Return Your Rental";
    const message = "You have not returned the accessory you rented. Please return it as soon as possible.";
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

        // חיפוש השכרות עם תאריך החזרה שמיועד למחר
        const rents = await Rent.find({
            rentReturnDate: { $gte: tomorrow, $lt: dayAfterTomorrow }
        }).populate("rentUser");

        // const recipients = rents
        //     .map(rent => rent.rentUser?.userMail)
        //     .filter(email => email);
        const recipients=["s0504172669@gmail.com"]

        if (recipients.length === 0) {
            console.log("No recipients found.");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipients.join(","),
            subject: subject,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Emails sent: ", info.response);
    } catch (error) {
        console.error("Error sending emails: ", error.message);
    }
}

module.exports = {
    sendEmails
};