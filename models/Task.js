import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
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
    isEditing: {
        type: Boolean,
        default: false,
    }
}, 
{
    timestamps: true,
});

export default mongoose.model('Task', TaskSchema);