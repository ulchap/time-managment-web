import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';
import Goal from '../models/Goal.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      name: req.body.name,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;
    const initialGoal = new Goal({
      user: user._id,
      timeType: 'day',
      tasksCompleted: 0,
      tasksReq: 0, 
      status: false, 
    });

    await initialGoal.save();
    user.goal = initialGoal._id;
    user.save();

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err, 'usercontr');
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await UserModel.find()
      .populate("name")
      .populate("email")
      .populate("avatarUrl")
      .exec();

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Can't get users",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

export const getFriends = async (req, res) => {
  try {

    const userId = req.params.id;
   
    UserModel.findById(userId).populate('friends')
            .then(doc => {

                if(!doc) {
                    return res.status(404).json({
                        message: 'Friend is not found',
                    });
                }

                res.status(200).json(doc.friends);
            })
            .catch(err => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Can't return a friend",
                    });
                }

            });
} catch (err) {
    console.log(err);
    res.status(500).json({
        message: "Can't get a friend",
    });
}
};

//Добавление друга
export const addFriend = async (req, res) => {
  try {
    const userId = req.params.id;
    const friendId = req.body.id;
    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);
  
    if (!user) {
      return res.status(404).send({ message: 'User is not found' });
    }

    if (!friend) {
      return res.status(404).send({ message: 'Friend is not found' });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'Friend already added' });
    }

    if (user._id === friend._id) {
      return res.status(400).json({ message: 'It is you :)' });
    }

    user.friends.push(friend._id);
    await user.save();

    res.status(200).json({ message: 'Friend added successfully' });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

// Удаление друга из списка друзей пользователя
export const deleteFriend = async (req, res) => {

  try {
      const userId = req.params.id;
      const friendId = req.body.id;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
      user.friends.pull(friendId);
      await user.save();
      res.status(200).json({ message: 'Друг успешно удален' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
      UserModel.updateOne({_id: req.userId}, 
      {
        name: req.body.name,
      })
              .then(async doc => {
                  if(!doc) {
                      return res.status(404).json({
                          message: 'User is not found',
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
                          message: "Can't update a User",
                      });
                  }
  
              });
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: "Can't update a User",
      });
  }
}
