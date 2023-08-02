import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
   {
      razorpay_payment_id: {
         type: String,
         required: [true, "Payment ID required"],
      },
      razorpay_subscription_id: {
         type: String,
         require: [true, "Subscription ID required"],
      },
      razorpay_signature: {
         type: String,
         required: [true, "Signature required"],
      },
   },
   {
      timestamps: true,
   }
);

const Payment = model("Payment", paymentSchema);

export default Payment;
