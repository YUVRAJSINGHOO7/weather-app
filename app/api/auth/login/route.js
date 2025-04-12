import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);
    console.log('Environment variables check:', {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
    });

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Generating JWT token for user:', email);
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const response = NextResponse.json(
      { message: 'Login successful', user: { name: user.name, email: user.email } },
      { status: 200 }
    );

    // Set cookie with more permissive settings for Vercel
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 86400,
      path: '/',
    });

    console.log('Login successful for user:', email);
    return response;
  } catch (error) {
    console.error('Login error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
} 