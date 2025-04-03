const Order = require("../Modules/OrderModule");
const User = require("../Modules/UserModule");
const Photography = require("../Modules/PhotographyModule");

// פונקציה לבדוק אם הצלמת פנויה
async function isPhotographyAvailable(photographyId, orderDate) {
    const existingOrders = await Order.find({
        orderPhotography: photographyId,
        orderDate: orderDate
    });
    return existingOrders.length === 0; // אם אין הזמנות, הצלמת פנויה
}

// פונקציה ליצירת הזמנה
async function createOrder(req, res) {
    try {
        const isAvailable = await isPhotographyAvailable(req.body.orderPhotography, req.body.orderDate);
        if (!isAvailable) {
            return res.status(400).send("הצלמת לא פנויה בתאריך זה.");
        }
        let order = new Order({
            orderDate: req.body.orderDate,
            orderUser: req.body.orderUser,
            orderPhotography: req.body.orderPhotography
        });
        await order.save();
        // הוספת ההזמנה למשתמש
        await User.findByIdAndUpdate(req.body.orderUser, { $push: { userOrders: order._id } });
        // הוספת ההזמנה לצילום
        await Photography.findByIdAndUpdate(req.body.orderPhotography, { $push: { photographyOrders: order._id } });
        res.status(201).send(order);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// פונקציה למחיקת הזמנה
async function deleteOrder(req, res) {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).send("ההזמנה לא נמצאה.");
        }       
        // הסרת ההזמנה מהמשתמש
        await User.findByIdAndUpdate(order.orderUser, { $pull: { userOrders: order._id } });
        res.status(200).send("ההזמנה נמחקה בהצלחה.");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// פונקציה לקבלת הזמנות לפי צילום
async function getOrdersByPhotography(req, res) {
    try {
        const orders = await Order.find({ orderPhotography: req.params.photographyId });
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// פונקציה לעדכון פרטי צילום בהזמנה
async function updatePhotography(req, res) {
    try {
        const o = await Order.findById(req.params.orderId)
        const isAvailable = await isPhotographyAvailable(req.body.orderPhotography, o.orderDate);
        if (!isAvailable) {
            return res.status(400).send("הצלמת לא פנויה בתאריך זה.");
        }

        const order = await Order.findByIdAndUpdate(req.params.orderId, { orderPhotography: req.body.orderPhotography }, { new: true });
        if (!order) {
            return res.status(404).send("ההזמנה לא נמצאה.");
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// פונקציה לקבלת הזמנות לפי משתמש
async function getOrdersByUser(req, res) {
    try {
        const orders = await Order.find({ orderUser: req.params.userId });
        res.status(200).send(orders);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// פונקציה לעדכון תאריך ההזמנה
async function updateDate(req, res) {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { orderDate: req.body.orderDate }, { new: true });
        if (!order) {
            return res.status(404).send("ההזמנה לא נמצאה.");
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    createOrder,
    deleteOrder,
    getOrdersByPhotography,
    updatePhotography,
    getOrdersByUser,
    updateDate
};
