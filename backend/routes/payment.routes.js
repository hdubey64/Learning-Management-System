import { Router } from "express";

import {
   allPayment,
   buySubscription,
   cancleSubscription,
   getRazorpayApiKey,
   verifySubscription,
} from "../controllers/payment.controller.js";
import {
   authorizedRoles,
   isLoggedIn,
} from "../middlewares/auth.middleware.config.js";

const paymentRouter = Router();

paymentRouter.route("/razorpay-key").get(isLoggedIn, getRazorpayApiKey);

paymentRouter.route("/subscribe").post(isLoggedIn, buySubscription);

paymentRouter.route("/verify").post(isLoggedIn, verifySubscription);

paymentRouter.route("/unsubscribe").post(isLoggedIn, cancleSubscription);

paymentRouter.route("/").get(isLoggedIn, authorizedRoles("ADMIN"), allPayment);

export default paymentRouter;
