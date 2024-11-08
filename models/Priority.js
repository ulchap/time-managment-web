import mongoose from 'mongoose';

const PrioritySchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['low', 'middle', 'high', 'without',],
        default: 'without',
    },
    level: {
        type: Number,
        enum: [1, 2, 3, 0],
        default: 0
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    teamTasks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TeamTask",
        },
      ],
    },
{
    timestamps: true,
});

export default mongoose.model('Priority', PrioritySchema);