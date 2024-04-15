const mongoose = require("mongoose");

const generateTaskNameIds = () => [
  new mongoose.Types.ObjectId("65aa9eff42fd18535cd2bd4a"),
  new mongoose.Types.ObjectId("65aa9f1542fd18535cd2bd51"),
  new mongoose.Types.ObjectId("65ab6c97ebc5facb41d820ee"),
  new mongoose.Types.ObjectId("65ab6ca1ebc5facb41d820f2"),
  new mongoose.Types.ObjectId("65ab6cb1ebc5facb41d820f6"),
  new mongoose.Types.ObjectId("65ab6cbaebc5facb41d820fa"),
  new mongoose.Types.ObjectId("65ab6cc8ebc5facb41d820fe"),
  new mongoose.Types.ObjectId("65ab6ccfebc5facb41d82102"),
  new mongoose.Types.ObjectId("65ab6cd9ebc5facb41d82106"),
  new mongoose.Types.ObjectId("65ab6ce0ebc5facb41d8210a"),
  new mongoose.Types.ObjectId("65ab6ceaebc5facb41d8210e"),
  new mongoose.Types.ObjectId("65ab6cf6ebc5facb41d82112"),
  new mongoose.Types.ObjectId("65ab6cf6ebc5facb41d82112"),
];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "admin",
    },
    refreshToken: {
      type: String,
    },
    lastLogin: {
      type: String,
    },
    lastLogout: {
      type: String,
    },
    taskNames: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TaskName",
        },
      ],
      default: generateTaskNameIds(),
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
