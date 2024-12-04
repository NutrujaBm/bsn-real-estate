import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["condo", "apartment"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rentalType: {
      type: String,
      required: true,
      enum: ["daily", "monthly"],
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    subdistrict: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    bedroom: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    bathroom: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    size: {
      type: Number,
      required: true,
    },
    roomNumber: {
      type: Number,
      required: false,
    },
    building: {
      type: String,
      required: false,
      trim: true,
    },
    floor: {
      type: Number,
      required: false,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    parking: {
      type: Number,
      required: false,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    utilities: {
      type: [String],
      required: false,
      trim: true,
    },
    university: {
      type: String,
      required: false,
      trim: true,
    },
    hospital: {
      type: String,
      required: false,
      trim: true,
    },
    mall: {
      type: String,
      required: false,
      trim: true,
    },
    school: {
      type: String,
      required: false,
      trim: true,
    },
    bus: {
      type: String,
      required: false,
      trim: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    expiryAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "closed"],
      default: "active",
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    lineId: {
      type: String,
      required: false,
      trim: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
