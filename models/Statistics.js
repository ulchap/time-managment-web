import mongoose from 'mongoose';

const StatisticsSchema = new mongoose.Schema({
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
    goalStatus: {
        type: Boolean,
        default: false,
    },
    countTasks: {
        type: Number,
        default: 0,
    },
}, 
{
    timestamps: true,
});

export default mongoose.model('Statistics', StatisticsSchema);