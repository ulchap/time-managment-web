//import TaskModel from '../models/Task.js';
import TeamTask from '../models/TeamTask.js';
import Category from '../models/Category.js';
import Deadline from '../models/Deadline.js';
import Priority from '../models/Priority.js';
import { getDateAfterAWeek } from '../middlewares/date.js';
import User from '../models/User.js';
import Project from '../models/Project.js'; 

export const getAll = async (req, res) => {
    try {
        const tasks = await TeamTask.find({user: req.userId}).populate('user').populate('deadline').
        populate('category').populate('priority').exec();

        res.json(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get tasks",
        });
    }
}

export const getOne = async (req, res) => {
    try {

        const taskId = req.params.id;
       
        TeamTask.findById(taskId)
                .then(doc => {

                    if(!doc) {
                        return res.status(404).json({
                            message: 'Task is not found',
                        });
                    }
    
                    res.json(doc);
                })
                .catch(err => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Can't return a task",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get a task",
        });
    }
}

export const remove = async (req, res) => {
    try {
        const taskId = req.params.id;

        TeamTask.findOneAndDelete({ _id: taskId })
                .then(async doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'Task is not found',
                        });
                    };

                    const user = await User.findById(req.userId);
                    user.teamTasks.pull(doc._id);
                    await user.save();

                    //удаляем у всех пользователей, которые учавствуют
                    for (let id of doc.users._id) {
                        friend = await User.findById(id);
                        friend.teamTasks.pull(doc._id);
                        await friend.save();
                    };

                    let category = await Category.findOne({ _id: doc.category._id });
                    if(category){
                        category.teamTasks.pull(doc._id);
                        await category.save();
                    };

                    let deadline = await Deadline.findOne({ _id: doc.deadline._id });
                    if(deadline){
                        deadline.teamTasks.pull(doc._id);
                        await deadline.save();
                        console.log(deadline.teamTasks.length)
                        if(!deadline.teamTasks.length){
                            await Deadline.findOneAndDelete({_id: deadline._id});
                        }
                    };

                    let priority = await Priority.findOne({ _id: doc.priority._id });
                    if(priority){
                        priority.teamTasks.pull(doc._id);
                        await priority.save();
                    };

                    res.json({
                        success: true,
                    });
                })
                .catch(err => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Can't delete a task",
                        });
                    }
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't delete a task",
        });
    }
}

export const create = async (req, res) => {
    try {

        let category = await Category.findOne({ name: req.body.category });
        if (!category) {
            category = await Category.findOne({ name: "default" });
        }

        let deadline;
        if(req.body.deadline) {
            deadline = await Deadline.findOne({ deadline: new Date(req.body.deadline) });
            if (!deadline) {
                deadline = new Deadline({
                    deadline: new Date(req.body.deadline),
                });
            }
        }
        else{
            const dateAfterWeek = getDateAfterAWeek();
            deadline = await Deadline.findOne({ deadline: dateAfterWeek });
            if(!deadline){
                deadline = new Deadline({
                    deadline: new Date(dateAfterWeek),
                });
            }
        }
        const savedDeadline = await deadline.save();

        let priority = await Priority.findOne({ title: req.body.priority });
        if (!priority) {
            priority = await Priority.findOne({ title: "without" });
        };
        const savedPriority = await priority.save();

        let project = await Project.findById(req.body.project);
        if(!project){
            return res.status(404).json({
                message: "Project is not found",
            });
        };

        for(let id of req.body.users){
            let friend = await User.findById(id);
            if(!friend){
                return res.status(404).json({
                    message: "Friend is not found",
                });
            }
        };

        const doc = new TeamTask({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            user: req.userId,
            category: category._id,
            deadline: savedDeadline._id,
            priority: savedPriority._id,
            users: req.body.users,
            project: project._id,
        });

        const task = await doc.save();

        const user = await User.findById(req.userId);

        user.teamTasks.push(task._id);
        category.teamTasks.push(task._id);
        savedDeadline.teamTasks.push(task._id);
        savedPriority.teamTasks.push(task._id);
        project.teamTasks.push(task._id);

        for(let id of task.users){
            id = id._id;
            let friend = await User.findById(id);
            friend.teamTasks.push(task._id);
            await friend.save();
        };


        await user.save();
        await category.save();
        await savedDeadline.save();
        await savedPriority.save();
        await project.save();
        

        res.json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Creation task error",
        });
    }
}

export const update = async (req, res) => {
    try {
        const taskId = req.params.id;
        let category, deadline, priority;

        const task = await TeamTask.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: 'Task is not found',
            });
        }

        if (req.body.category && task.category.name !== req.body.category) {
            const oldCategory = await Category.findById(task.category._id);
            oldCategory.teamTasks.pull(task._id);
            await oldCategory.save();
        };

        if (req.body.deadline && task.deadline.deadline.toString() !== req.body.deadline) {
            const oldDeadline = await Deadline.findById(task.deadline._id);
            oldDeadline.teamTasks.pull(task._id);
            await oldDeadline.save();
        };

        if (req.body.priority && task.priority.title !== req.body.priority) {
            const oldPriority = await Priority.findById(task.priority._id);
            oldPriority.teamTasks.pull(task._id);
            await oldPriority.save();
        };

        if (req.body.users && JSON.stringify(task.users._id) !== JSON.stringify(req.body.users)) {
            // Удалить задачу из списка задач каждого текущего пользователя
            for (let id of task.users._id) {
                let user = await User.findById(id);
                user.teamTasks.pull(task._id);
                await user.save();
            };

            // Добавить задачу в список задач каждого нового пользователя
            for (let id of req.body.users) {
                let user = await User.findById(id);
                user.teamTasks.push(task._id);
                await user.save();
            };
        };

        if(req.body.category){
            category = await Category.findOne({ name: req.body.category });
            if(!category) {
                return res.status(404).json({
                    message: 'Category is not found',
                });
            }
            category.teamTasks.push(task._id);
        }
        else{
            category = await Category.findOne({ _id: task.category._id});
        }
        const savedCategory = await category.save();
        if(req.body.deadline){
            deadline = await Deadline.findOne({ name: req.body.deadline });
            if(!deadline) {
                deadline = new Deadline({
                    deadline: new Date(req.body.deadline),
                });
            }
            deadline.teamTasks.push(task._id);
        }
        else{
            deadline = await Deadline.findById(task.deadline._id);
        }
        const savedDeadline = await deadline.save();
        if(req.body.priority){
            priority = await Priority.findOne({ name: req.body.priority });
            if(!priority) {
                return res.status(404).json({
                    message: 'Priority is not found',
                });
            }
            priority.teamTasks.push(task._id);
        }
        else{
            priority = await Priority.findById(task.priority._id);
        }
        const savedPriority = await priority.save();

        TeamTask.updateOne({_id: taskId}, 
        {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            user: req.userId,
            category: savedCategory._id,
            deadline: savedDeadline._id,
            priority: savedPriority._id,
            users: req.body.users,
            project: req.body.project,
        })
                .then(async doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'Task is not found',
                        });
                    }
                    res.json({
                        success: true,
                    });
                })
                .catch(err => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Can't update a task",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't update a task",
        });
    }
}