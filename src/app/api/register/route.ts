import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    // Connect to the database
    await connectDB();

    // Parse request body
    const body: RegisterRequestBody = await req.json();
    const { name, email, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return success response
    return NextResponse.json(
      { message: 'User registered successfully', userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
