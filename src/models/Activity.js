import pkg from "mongoose";
const { Schema, model, models } = pkg;

const ActivitySchema = new Schema({
  userEmail: { type: String, required: true },
  title: String,
  type: String,
  course: { type: String, required: true },
  dueDate: String,
  status: {
    type: String,
    enum: ["Pending", "Done", "Overdue"],
  },
});

const Activity = models.Activity || model("Activity", ActivitySchema);

export default Activity;