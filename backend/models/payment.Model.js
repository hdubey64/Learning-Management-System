import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
   {
      razorpay_payment_id: {
         type: "string",
         required: [true, "Payment ID required"],
      },
      razorpay_subscription_id: {
         type: "string",
         require: [true, "Subscription ID required"],
      },
      razorpay_signature: {
         type: "string",
         required: [true, "Signature required"],
      },
   },
   {
      timestamps: true,
   }
);

const Payment = model("Payment", paymentSchema);

export default Payment;
