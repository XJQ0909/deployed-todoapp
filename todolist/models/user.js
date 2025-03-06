const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,  // 用户名是必填项
        // unique: true,    // 用户名是唯一的
        minlength: 1,    // 最小长度为 1
        maxlength: 255,   // 最大长度为 255
    },
    hashed_password: {
        type: String,
        required: true,  // 密码是必填项
    }
});

const User = mongoose.model('User', userSchema);



module.exports = User;  

