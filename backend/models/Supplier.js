import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactPerson: String,
    email: String,
    phone: String,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);
