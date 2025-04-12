import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  console.log('Auth check called');
  const token = request.cookies.get('token')?.value;
  console.log('Token exists:', !!token);

  if (!token) {
    return NextResponse.json(
      { error: 'No token provided' },
      { status: 401 }
    );
  }

  try {
    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully');
    
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      console.log('User not found for token');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    console.log('User found:', user.email);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Token verification error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
} 