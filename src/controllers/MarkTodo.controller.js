import { validationResult } from "express-validator";
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import Todo from "../models/Todo.js"; // Import the Todo model
import User from "../models/User.js";

export const MarkTodo = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json(jsonGenerate(StatusCode.VALIDATION_ERROR, "todo_id is required", errors.array()));
  }

  try {
    const { todo_id } = req.body;

    if (!todo_id) {
      return res.json(jsonGenerate(StatusCode.VALIDATION_ERROR, "todo_id is required"));
    }

    const todo = await Todo.findOne({
      _id: todo_id,
      userId: req.userId,
    });

    if (!todo) {
      return res.json(jsonGenerate(StatusCode.NOT_FOUND, "Todo not found"));
    }

    // Toggle the `isCompleted` field
    todo.isCompleted = !todo.isCompleted;

    // Save the updated todo
    await todo.save();

    return res.json(jsonGenerate(StatusCode.SUCCESS, "Updated", todo));
  } catch (error) {
    return res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY, "Could not update", error));
  }
};
