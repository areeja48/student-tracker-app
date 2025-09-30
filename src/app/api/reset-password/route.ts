import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  const { token, password } = await req.json();

  await dbConnect();

  // Find the user by reset token and check if it is valid and not expired
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }, // Ensure token is not expired
  });

  if (!user) {
    return NextResponse.json(
      { message: 'Invalid or expired token.' },
      { status: 400 }
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update user's password and clear reset token
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  return NextResponse.json({ message: 'Password has been successfully reset.' });
}
