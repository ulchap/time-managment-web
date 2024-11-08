import GoalModel from '../models/Goal.js';
import UserModel from '../models/User.js';

export const get = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).populate('goal');
        if (!user) {
            res.status(404).json({
                message: "Can't find user",
            });
        }       
        res.json(user.goal)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get goal",
        });
    }
}
export const remove = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message: 'user is not found',
            });
        }
        const goalId = user.goal._id;
        user.goal = null;
        await user.save();
        GoalModel.findOneAndDelete(goalId)
                .then(doc => {

                    if(!doc) {
                        return res.status(404).json({
                            message: 'goal is not found',
                        });
                    };
                    res.json({
                        success: true,
                    });
                })
                .catch(err => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Can't delete a goal",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't delete a goal",
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new GoalModel({
            timeType: req.body.timeType,
            tasksReq: req.body.tasksReq,
            user: req.userId,
            tasksCompleted: req.body.tasksCompleted,
        });

        const goal = await doc.save();
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message: 'user is not found',
            });
        }
        user.goal = goal._id;
        await user.save();

        res.json(goal);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Creation goal error",
        });
    }
}

export const update = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        const goalId = user.goal._id;
        GoalModel.updateOne({_id: goalId}, 
        {
            timeType: req.body.timeType,
            tasksReq: req.body.tasksReq,
            status: req.body.status,
            tasksCompleted: req.body.tasksCompleted,
        })
                .then(doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'goal is not found',
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
                            message: "Can't update a goal",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't update a goal",
        });
    }
}