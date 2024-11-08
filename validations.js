import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
  body('name', 'Укажите имя').isLength({ min: 3 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const taskCreateValidation = [
  body('title', 'Длина задачи должна быть более одного символа').isLength({ min: 2 }).isString(),
  body('description', 'Неверный формат').optional().isString(),
];

export const categoryCreateValidation = [
  body('name', 'Длина категории должна быть более одного символа').isLength({ min: 2 }).isString(),
  body('color', 'Неверный формат').isString(),
];

export const goalCreateValidation = [
  body('timeType', 'Неверный формат').isString(),
  body('tasksReq', 'Неверный формат').isInt({ min: 1, max: 100 }),
];

export const projectCreateValidation = [
  body('title', 'Длина проекта должна быть более одного символа').isLength({ min: 2 }).isString(),
];
