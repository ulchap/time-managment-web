import CategoryModel from '../models/Category.js';

export const getAll = async (req, res) => {
    try {
        const categories = await CategoryModel.find().populate('tasks').exec();

        res.json(categories);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get categories",
        });
    }
}

export const getOne = async (req, res) => {
    try {

        const categoryId = req.params.id;
       
        CategoryModel.findById(categoryId)
                .then(doc => {

                    if(!doc) {
                        return res.status(404).json({
                            message: 'Category is not found',
                        });
                    }
    
                    res.json(doc);
                })
                .catch(err => {
                    if(err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Can't return a Category",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't get a Category",
        });
    }
}

export const remove = async (req, res) => {
    try {
        const categoryId = req.params.id;
        CategoryModel.findOneAndDelete(categoryId)
                .then(doc => {

                    if(!doc) {
                        return res.status(404).json({
                            message: 'Category is not found',
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
                            message: "Can't delete a Category",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't delete a Category",
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new CategoryModel({
            name: req.body.name,
            color: req.body.color,
        });

        const category = await doc.save();

        res.json(category);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Creation Category error",
        });
    }
}

export const update = async (req, res) => {
    try {
        const categoryId = req.params.id;
        CategoryModel.updateOne({_id: categoryId}, 
        {
            name: req.body.name,
            color: req.body.color,
        })
                .then(doc => {
                    if(!doc) {
                        return res.status(404).json({
                            message: 'Category is not found',
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
                            message: "Can't update a Category",
                        });
                    }
    
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Can't update a Category",
        });
    }
}