import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; 
import connectDB from '@/lib/mongodb';
import Activity from '@/models/Activity';

// ✅ Server-side logic to calculate assignment status
function getStatus(dueDate: string): 'Pending' | 'Done' | 'Overdue' {
  if (!dueDate) return 'Pending'; // no due date means Pending by default

  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  if (due < today || due === today) {
    return 'Done'; 
  }
  else if (due > today){
    return 'Pending';
  }
else
  return 'Pending'; // due date is today or in future
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const userEmail = session.user?.email;
    const activities = await Activity.find({ userEmail }).lean();

    return NextResponse.json(activities);
  } catch (error) {
    console.error('GET /api/activities error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, dueDate, course } = body;

    if (!title || !type || !dueDate || !course) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const userEmail = session.user?.email;

    const status = getStatus(dueDate);

    const newActivity = new Activity({
      title,
      type,
      dueDate: new Date(dueDate),
      course,
      status,
      userEmail,
    });

    await newActivity.save();

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/activities error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, title, type, dueDate, course } = body;

    if (!id) {
      return NextResponse.json({ message: 'Missing activity ID' }, { status: 400 });
    }

    await connectDB();
    const userEmail = session.user?.email;

    const activity = await Activity.findOne({ _id: id, userEmail });
    if (!activity) return NextResponse.json({ message: 'Activity not found' }, { status: 404 });

    activity.title = title ?? activity.title;
    activity.type = type ?? activity.type;
    activity.dueDate = dueDate ? new Date(dueDate) : activity.dueDate;
    activity.course = course ?? activity.course;

    // Update status based on new dueDate if it changed
    if (dueDate) {
      activity.status = getStatus(dueDate);
    }

    await activity.save();

    return NextResponse.json(activity);
  } catch (error) {
    console.error('PUT /api/activities error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'Missing activity ID' }, { status: 400 });
    }

    await connectDB();
    const userEmail = session.user?.email;

    const activity = await Activity.findOneAndDelete({ _id: id, userEmail });
    if (!activity) return NextResponse.json({ message: 'Activity not found' }, { status: 404 });

    return NextResponse.json({ message: 'Activity deleted' });
  } catch (error) {
    console.error('DELETE /api/activities error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
