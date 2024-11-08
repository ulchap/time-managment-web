import Project from '../models/Project.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import TeamTask from '../models/TeamTask.js';

export const getAll = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const projects = await Project.find({users: req.userId}).populate({
            path: 'teamTasks',
            populate: [
                { path: 'deadline', model: 'Deadline'},
                {path: 'priority', model: 'Priority'}
            ],
          }).
        populate('category').populate('users').exec();

        res.json(projects);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get projects",
        });
    }
};

export const getOne = async (req, res) => {
    try {

        const projectId = req.params.id;
       
        Project.findById(projectId)
                .then(doc => {

                    if(!doc) {
                        return res.status(404).json({
                            message: 'Project is not found',
                        });
                    }
    
                    res.json(doc);
                })
                .catch(err => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Can't return a Project",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get a Project",
        });
    }
};

export const remove = async (req, res) => {
    try {
        const projectId = req.params.id;

        Project.findOneAndDelete({ _id: projectId })
                .then(async doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'Project is not found',
                        });
                    };

                    const users = await User.find({ projects: projectId });

                    // Обнови массив projects у каждого пользователя
                    for (const user of users) {
                      user.projects = user.projects.filter(
                        (project) => project.toString() !== projectId
                      );
                      await user.save(); // Сохранение изменений в базе данных
                    }

                    res.json({
                        success: true,
                    });
                })
                .catch(err => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Can't delete a Project",
                        });
                    }
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't delete a Project",
        });
    }
};

export const create = async (req, res) => {
    try {

        let category = await Category.findOne({ name: req.body.category });
        if (!category) {
            category = await Category.findOne({ name: "default" });
        }
        

        if (typeof req.body.users !== "string") {
          for (let id of req.body.users) {
            console.log(id);
            let friend = await User.findById(id);
            if (!friend) {
              return res.status(404).json({
                message: "Friend is not found",
              });
            }
          }
        }

        req.body.users.push(req.userId);

        const doc = new Project({
            title: req.body.title,
            category: category._id,
            users: req.body.users,
        });

        const project = await doc.save();

        const user = await User.findById(req.userId);

        user.projects.push(project._id);

        for(let id of project.users){
            id = id._id;
            let friend = await User.findById(id);
            friend.projects.push(project._id);
            await friend.save();
        };


        await user.save();
        
        res.json(project);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Creation Project error",
        });
    }
}

export const update = async (req, res) => {
    try {
        const projectId = req.params.id;
        let category;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: 'Project is not found',
            });
        }

        if (req.body.users && JSON.stringify(project.users._id) !== JSON.stringify(req.body.users)) {
            // Удалить project из списка project каждого текущего пользователя
            for (let id of project.users._id) {
                let user = await User.findById(id);
                user.projects.pull(project._id);
                await user.save();
            };

            // Добавить project в список project каждого нового пользователя
            for (let id of req.body.users) {
                let user = await User.findById(id);
                user.projects.push(task._id);
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
        }
        else{
            category = await Category.findOne({ _id: project.category._id});
        }
        const savedCategory = await category.save();

        Project.updateOne({_id: projectId}, 
        {
            title: req.body.title,
            users: req.body.users,
            category: savedCategory._id,
            teamTasks: req.body.teamTasks,
        })
                .then(async doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'Project is not found',
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
                            message: "Can't update a Project",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't update a Project",
        });
    }
}