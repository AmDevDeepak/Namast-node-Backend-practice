const mongoose = require("mongoose");
const connectionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Ignored", "Accepted", "Rejected", "Interested"],
        message: "{VALUE} is not a valid status",
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionSchema.index({
  from: 1,
  to: 1,
});

const Connection = mongoose.model("Connection", connectionSchema);
module.exports = Connection;
