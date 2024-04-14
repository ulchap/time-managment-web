import TaskModel from '../models/Task.js';

export const create = async (req, res) => {
    try {
        const doc = new TaskModel({
            title: req.body.title,
            description: req.body.description,
            status: false,
            user: req.userId,
        });

        const task = await doc.save();

        res.json();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Creation task error",
        });
    }
}