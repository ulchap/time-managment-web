import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timeType: {
        type: String, 
        default: 'day',
        enum: ['day', 'week', 'month', 'year',],
    },
    tasksCompleted: {
        type: Number,
        default: 0,
    },
    tasksReq: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: false,
    },
    },
{
    timestamps: true,
});

export default mongoose.model('Goal', GoalSchema);