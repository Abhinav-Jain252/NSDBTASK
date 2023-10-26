import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import Todo from "../models/Todo.js";
import User from "../models/User.js";

export const RemoveTodo = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json(jsonGenerate(StatusCode.VALIDATION_ERROR, "todo_id is required", errors.mapped()));
  }

  try {
    const { todo_id } = req.body;

    const result = await Todo.findOneAndDelete({
      userId: req.userId,
      _id: todo_id,
    });

    if (result) {
      const user = await User.findOneAndUpdate(
        {
          _id: req.userId,
        },
        {
          $pull: { todos: todo_id },
        }
      );

      return res.json(jsonGenerate(StatusCode.SUCCESS, "Todo deleted", result));
    } else {
      return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Todo not found", null));
    }
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Couldn't delete", null));
  }
};
