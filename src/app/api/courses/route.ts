import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const userEmail = session.user?.email;
  const courses = await Course.find({ userEmail }).lean();
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, instructor, progress } = body;

  await connectDB();
  const userEmail = session.user?.email;
  const newCourse = new Course({ title, instructor, progress, userEmail });
  await newCourse.save();

  return NextResponse.json(newCourse, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, title, instructor, progress } = body;

  await connectDB();
  const userEmail = session.user?.email;

  const course = await Course.findOne({ _id: id, userEmail });
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });

  course.title = title ?? course.title;
  course.instructor = instructor ?? course.instructor;
  course.progress = progress ?? course.progress;
  await course.save();

  return NextResponse.json(course);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id } = body;

  await connectDB();
  const userEmail = session.user?.email;

  const course = await Course.findOneAndDelete({ _id: id, userEmail });
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });

  return NextResponse.json({ message: 'Course deleted' });
}
