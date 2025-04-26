import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';

const JWT_SECRET = 'your_jwt_secret';

export async function GET(request: NextRequest, { params }: { params: { conversationId: string } }) {
  await connectDB();

  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    jwt.verify(token, JWT_SECRET);
    const { conversationId } = params;

    const messages = await Message.find({ conversationId }).populate('sender', 'fullName');
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { conversationId: string } }) {
  await connectDB();

  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { conversationId } = params;
    const { content, attachment } = await request.json();

    if (!content && !attachment) {
      return NextResponse.json({ error: 'Message content or attachment is required' }, { status: 400 });
    }

    const message = new Message({
      conversationId,
      sender: decoded.userId,
      content: content || '',
      attachment,
      timestamp: new Date(),
    });

    await message.save();
    await message.populate('sender', 'fullName');

    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}