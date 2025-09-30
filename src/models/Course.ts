import { Schema, model, models } from 'mongoose';

const CourseSchema = new Schema({
  userEmail: { type: String, required: true }, 
  name: String,
  title: String,
  instructor: String,
  progress: Number, 
});

const Course = models.Course || model('Course', CourseSchema);
export default Course;
