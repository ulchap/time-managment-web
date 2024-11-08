import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    teamTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamTask'
    }],
    statistics: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Statistics'
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, 
{
    timestamps: true,
});

export default mongoose.model('User', UserSchema);