const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    // id: {
    //     type: String,
    //     required: true, // id 必须存在
    //     unique: true,   // id 是唯一的
    // },
    id: {  // 关联到 User 模型
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user_name: {
        type: String,
        required: true, // 用户名是必填的
    },
    title: {
        type: String,
        required: true, // 标题是必填的
        maxlength: 30,   // 标题最大长度为 30
    },
    completed: {
        type: Boolean,
        default: false,  // 默认值为 false
    },
    date: {
        type: String,
        maxlength: 300,   // 日期最大长度为 300
    }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;  



