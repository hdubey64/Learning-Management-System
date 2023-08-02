import User from "../models/user.Model.js";
import Payment from "../models/payment.Model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";
import crypto from "crypto";

export const getRazorpayApiKey = async (req, res, next) => {
   try {
      return res.status(200).json({
         success: true,
         message: "Razorpay API key",
         key: process.env.RAZORPAY_KEY_ID,
      });
   } catch (error) {
      return next(new AppError(error, 500));
   }
};

export const buySubscription = async (req, res, next) => {
   try {
      const { id } = req.user;
      const user = await User.findOne({ _id: id });

      if (!user) {
         return next(new AppError("Unauthorized, Please Login"));
      }

      if (user.role === "ADMIN") {
         return next(new AppError("You are not allowed to subscribe", 400));
      }
      console.log("user.role", user.role);
      let subscription;
      try {
         subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            total_count: 1,
         });

         console.log("subscription", subscription);
      } catch (error) {
         console.log("error", error);
      }

      user.subscription.id = subscription.id;

      user.subscription.status = subscription.status;

      await user.save();

      return res.status(200).json({
         success: true,
         message: "Subscribe successfully",
         subscription_id: subscription.id,
      });
   } catch (error) {
      console.log("error", error);
      return next(new AppError(error, 500));
   }
};

export const verifySubscription = async (req, res, next) => {
   try {
      const { id } = req.user;
      const {
         razorpay_payment_id,
         razorpay_signature,
         razorpay_subscription_id,
      } = req.body;

      const user = await User.findOne({ _id: id });
      if (!user) {
         return next(new AppError("Unauthorized user, Please Login", 400));
      }
      console.log(user);
      if (user.role === "ADMIN") {
         return next(new AppError("You are not allowed to subscribe", 400));
      }

      const subscriptionId = user.subscription.id;
      const generatedSignature = crypto
         .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
         .update(`${razorpay_payment_id} | ${subscriptionId}`)
         .digest("hex");

      if (generatedSignature !== razorpay_signature) {
         return next(
            new AppError("Payment not varified, please try again", 500)
         );
      }

      await Payment.create({
         razorpay_payment_id,
         razorpay_signature,
         razorpay_subscription_id,
      });

      user.subscription.status = "active";
      await user.save();

      return res.status(200).json({
         success: true,
         message: "Payment verified successfully",
      });
   } catch (error) {
      console.log(error);
      return next(new AppError(error, 500));
   }
};

export const cancleSubscription = async (req, res, next) => {
   try {
      const { id } = req.user;
      const user = await User.findOne({ _id: id });

      if (!user) {
         return next(new AppError("Unauthorized user, Please Login", 500));
      }

      if (user.role === "ADMIN") {
         return next(
            new AppError("Admin cannot purchase or cancle subscription", 500)
         );
      }

      const subscriptionId = user.subscription.id;
      const subscription = await razorpay.subscriptions.cancel(subscriptionId);

      user.subscription.status = subscription.status;

      await User.save();
   } catch (error) {
      return next(new AppError(error.message, 500));
   }
};

export const allPayment = async (req, res, next) => {
   try {
      const { count } = req.query;

      const subscriptions = await razorpay.subscriptions.all({
         count: count || 10,
      });

      res.status(200).json({
         success: true,
         message: "All payments",
         subscriptions,
      });
   } catch (error) {
      return next(new AppError(e.message, 500));
   }
};
