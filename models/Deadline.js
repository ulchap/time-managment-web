import mongoose from 'mongoose';

const DeadlineSchema = new mongoose.Schema({
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
    
    deadline: {
        type: Date,
        required: true
    },
    },
{
    timestamps: true,
});

export default mongoose.model('Deadline', DeadlineSchema);