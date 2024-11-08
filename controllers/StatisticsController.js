import Statistics from "../models/Statistics";
import User from "../models/User";

export const getAll = async (req, res) => {
    try {
        const statistics = await Statistics.find();

        res.json(statistics);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get Statistics",
        });
    }
}

export const getOne = async (req, res) => {
    try {

        Statistics.findOne({user: userId})
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'Statistics is not found',
                });
            }

            res.json(doc);
        })
        .catch(err => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    message: "Can't return a Statistics",
                });
            }

        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get a Statistics",
        });
    }
}

export const remove = async (req, res) => {
    try {
        Statistics.findOneAndDelete({user: userId})
                .then(doc => {

                    if(!doc) {
                        return res.status(404).json({
                            message: 'Statistics is not found',
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
                            message: "Can't delete a Statistics",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't delete a Statistics",
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new Statistics({
            timeType: req.body.timeType,
            countTasks: req.body.countTasks,
        });

        const priority = await doc.save();

        res.json(priority);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Creation statistics error",
        });
    }
}

export const update = async (req, res) => {
    try {
        Statistics.updateOne({user: userId}, 
        {
            timeType: req.body.timeType,
            countTasks: req.body.countTasks,
            goalStatus: req.body.goalStatus,
        })
                .then(doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'Statistics is not found',
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
                            message: "Can't update a Statistics",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't update a Statistics",
        });
    }
}