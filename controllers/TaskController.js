import TaskModel from '../models/Task.js';
import Category from '../models/Category.js';
import Deadline from '../models/Deadline.js';
import Priority from '../models/Priority.js';
import { getDateAfterAWeek } from '../middlewares/date.js';
import User from '../models/User.js';
import Goal from '../models/Goal.js';

export const getAll = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const tasks = await TaskModel.find({user: user._id}).populate('user').populate('deadline').
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
       
        TaskModel.findById(taskId)
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

        TaskModel.findOneAndDelete({ _id: taskId })
                .then(async doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'Task is not found',
                        });
                    };

                    const user = await User.findById(req.userId);
                    user.tasks.pull(doc._id);
                    await user.save();

                    let category = await Category.findOne({ _id: doc.category._id });
                    if(category){
                        category.tasks.pull(doc._id);
                        await category.save();
                    };

                    let deadline = await Deadline.findOne({ _id: doc.deadline._id });
                    if(deadline){
                        deadline.tasks.pull(doc._id);
                        await deadline.save();
                        console.log(deadline.tasks.length)
                        if(!deadline.tasks.length){
                            await Deadline.findOneAndDelete({_id: deadline._id});
                        }
                    };

                    let priority = await Priority.findOne({ _id: doc.priority._id });
                    if(priority){
                        priority.tasks.pull(doc._id);
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
        }
        const savedPriority = await priority.save();

        const doc = new TaskModel({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            user: req.userId,
            category: category._id,
            deadline: savedDeadline._id,
            priority: savedPriority._id,
        });

        const task = await doc.save();

        const user = await User.findById(req.userId);

        user.tasks.push(task._id);
        category.tasks.push(task._id);
        savedDeadline.tasks.push(task._id);
        savedPriority.tasks.push(task._id);


        await user.save();
        await category.save();
        await savedDeadline.save();
        await savedPriority.save();
        

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

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({
                message: 'Task is not found',
            });
        }

        if(req.body.status !== null){
            const user = await User.findById(req.userId);
            const goal = await Goal.findById(user.goal);
            if (req.body.status){
                goal.tasksCompleted += 1;
                if(goal.tasksCompleted === goal.tasksReq){
                    goal.status = true;
                };
                await goal.save();
            }
            else{
                goal.tasksCompleted -= 1;
                if(goal.tasksCompleted !== goal.tasksReq){
                    goal.status = false;
                };
                await goal.save();
            }
        }

        if (req.body.category && task.category.name !== req.body.category) {
            const oldCategory = await Category.findById(task.category._id);
            oldCategory.tasks.pull(task._id);
            await oldCategory.save();
        };

        if (req.body.deadline && task.deadline.deadline !== req.body.deadline) {
            const oldDeadline = await Deadline.findById(task.deadline._id);
            oldDeadline.tasks.pull(task._id);
            await oldDeadline.save();
        };

        if (req.body.priority && task.priority.title !== req.body.priority) {
            const oldPriority = await Priority.findById(task.priority._id);
            oldPriority.tasks.pull(task._id);
            await oldPriority.save();
        };

        if(req.body.category){
            category = await Category.findOne({ name: req.body.category });
            if(!category) {
                return res.status(404).json({
                    message: 'Category is not found',
                });
            }
            category.tasks.push(task._id);
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
            deadline.tasks.push(task._id);
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
            priority.tasks.push(task._id);
        }
        else{
            priority = await Priority.findById(task.priority._id);
        }
        const savedPriority = await priority.save();

        TaskModel.updateOne({_id: taskId}, 
        {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            user: req.userId,
            category: savedCategory._id,
            deadline: savedDeadline._id,
            priority: savedPriority._id,
        })
                .then(async doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'Task is not found',
                        });
                    }
                    // if(req.body.category){
                    //     let category = await Category.findOne({ _id: doc.category._id });
                    //     if(!category) {
                    //         return res.status(404).json({
                    //             message: 'Category is not found',
                    //         });
                    //     }
                    //     category.tasks.push(doc._id);
                    //     await category.save();
                    // }
                    // if(req.body.deadline){
                    //     let deadline = await Deadline.findOne({ _id: doc.deadline._id });
                    //     if(!deadline) {
                    //         deadline = new Deadline({
                    //             deadline: new Date(req.body.deadline),
                    //         });
                    //     }
                    //     deadline.tasks.push(doc._id);
                    //     await deadline.save();
                    // }
                    // if(req.body.priority){
                    //     let priority = await Priority.findOne({ _id: doc.priority._id });
                    //     if(!priority) {
                    //         return res.status(404).json({
                    //             message: 'Priority is not found',
                    //         });
                    //     }
                    //     priority.tasks.push(doc._id);
                    //     await priority.save();
                    // }
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