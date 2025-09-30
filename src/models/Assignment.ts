import { Schema, model, models } from 'mongoose';

const AssignmentSchema = new Schema({
  userEmail: { type: String, required: true },
  title: String,
  instructor: String,
  dueDate: String,
  totalMarks: Number,
  obtainedMarks: Number,
    status: {
    type: String,
    enum: ['Pending', 'Submitted', 'Overdue']
  },

});

const Assignment = models.Assignment || model('Assignment', AssignmentSchema);
export default Assignment;
