import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    teamTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeamTask',
    }],

}, 
{
    timestamps: true,
});

ProjectSchema.pre('remove', async function(next) {
    // Удалить все задачи, связанные с этим проектом
    await this.model('TeamTask').deleteMany({ _id: { $in: this.teamTasks } });

    // Удалить ссылки на этот проект у всех пользователей
    await this.model('User').updateMany(
        { _id: { $in: this.users } },
        { $pull: { projects: this._id } }
    );

    next();
});

export default mongoose.model('Project', ProjectSchema);