const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    Emp_id: {
        type: String,
        required: true,
        unique: true,
    },
    attendance:{
        type:Array,
    }
});

const User = mongoose.model("user", UserSchema);

module.exports = User;