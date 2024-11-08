import mongoose from 'mongoose';
import Task from './Task.js';

const TeamTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    deadline: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deadline',
    },
    priority: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Priority',
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        //required: true,
    },
}, 
{
    timestamps: true,
});

export default mongoose.model('TeamTask', TeamTaskSchema);