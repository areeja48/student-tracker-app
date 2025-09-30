import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import sendEmail from '@/lib/sendEmail';

export async function POST(req: Request) {
  const { email } = await req.json();

  await dbConnect();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'If the user exists, a reset link will be sent' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = Date.now() + 1000 * 60 * 60; // 1 hour

  user.resetToken = token;
  user.resetTokenExpiry = expiry;
  await user.save();

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset your password',
    text: `Click the link to reset your password: ${resetUrl}`,
  });

  return NextResponse.json({ message: 'If the user exists, a reset link will be sent' });
}