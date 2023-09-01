import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    bio: String,
    image: String,
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread"
        }
    ],
    onboarded: {type:Boolean , default: false},
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "community"
        }
    ]

});

const User = mongoose.models.User || mongoose.model("User", userShema);

export default User;