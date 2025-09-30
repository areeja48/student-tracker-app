import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';

// ✅ Server-side logic to calculate assignment status
function getStatus(dueDate: string, obtainedMarks?: number | null): 'Pending' | 'Submitted' | 'Overdue' {
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (obtainedMarks !== null && obtainedMarks !== undefined) {
    return 'Submitted';
  } else if (due >= today) {
    return 'Pending';
  } else {
    return 'Overdue';
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const userEmail = session.user?.email;
  const assignments = await Assignment.find({ userEmail }).lean();

  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, instructor, dueDate, totalMarks, obtainedMarks } = body;

  if (!title || !instructor || !dueDate || !totalMarks) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  await connectDB();
  const userEmail = session.user?.email;

  // ✅ Calculate status on the server
  const status = getStatus(dueDate, obtainedMarks);

  const newAssignment = new Assignment({
    title,
    instructor,
    dueDate: new Date(dueDate),
    totalMarks,
    obtainedMarks: obtainedMarks ?? null,
    status,
    userEmail,
  });

  await newAssignment.save();
  return NextResponse.json(newAssignment, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, title, instructor, dueDate, totalMarks, obtainedMarks } = body;

  if (!id) return NextResponse.json({ message: 'Missing assignment ID' }, { status: 400 });

  await connectDB();
  const userEmail = session.user?.email;

  const assignment = await Assignment.findOne({ _id: id, userEmail });
  if (!assignment) return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });

  assignment.title = title ?? assignment.title;
  assignment.instructor = instructor ?? assignment.instructor;
  assignment.dueDate = dueDate ? new Date(dueDate) : assignment.dueDate;
  assignment.totalMarks = totalMarks ?? assignment.totalMarks;
  assignment.obtainedMarks = obtainedMarks ?? assignment.obtainedMarks;

  // ✅ Recalculate status on update
  assignment.status = getStatus(assignment.dueDate, assignment.obtainedMarks);

  await assignment.save();
  return NextResponse.json(assignment);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id } = body;

  if (!id) return NextResponse.json({ message: 'Missing assignment ID' }, { status: 400 });

  await connectDB();
  const userEmail = session.user?.email;

  const assignment = await Assignment.findOneAndDelete({ _id: id, userEmail });
  if (!assignment) return NextResponse.json({ message: 'Assignment not found' }, { status: 404 });

  return NextResponse.json({ message: 'Assignment deleted' });
}
