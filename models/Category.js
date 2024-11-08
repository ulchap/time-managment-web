import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  color: {
    type: String,
    default: "gray",
    enum: [
      "blue",
      "red",
      "green",
      "yellow",
      "pink",
      "purple",
      "orange",
      "gray",
    ],
  },

  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],

  teamTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamTask",
    },
  ],
});

export default mongoose.model('Category', CategorySchema);