import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
import CryptoJS from 'crypto-js';

// ✅ Encryption utility functions
class MessageEncryption {
  static hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}

function extractConversationIdFromUrl(request: NextRequest): string | null {
  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const idIndex = segments.findIndex(seg => seg === 'messages') + 1;
  return segments[idIndex] || null;
}

export async function GET(request: NextRequest) {
  await connectDB();

  const conversationId = extractConversationIdFromUrl(request);
  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversationId in URL' }, { status: 400 });
  }

  try {
    // ✅ Updated to support both Authorization header and cookies
    let token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = request.cookies.get('token')?.value;
    }
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // ✅ Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const isParticipant = conversation.participants.some((p: any) => 
      p.toString() === decoded.userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Unauthorized - not a conversation participant' }, { status: 403 });
    }

    // ✅ Fetch messages with encryption info
    const messages = await Message.find({ conversationId })
      .populate('sender', 'fullName profileImageUrl role')
      .sort({ timestamp: 1 });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();

  const conversationId = extractConversationIdFromUrl(request);
  if (!conversationId) {
    return NextResponse.json({ error: 'Missing conversationId in URL' }, { status: 400 });
  }

  try {
    // ✅ Updated to support both Authorization header and cookies
    let token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      token = request.cookies.get('token')?.value;
    }
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // ✅ Updated to include encryption support
    const { content, attachment, isEncrypted = false } = await request.json();

    if (!content && !attachment) {
      return NextResponse.json(
        { error: 'Message content or attachment is required' },
        { status: 400 }
      );
    }

    // ✅ Verify user is part of conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const isParticipant = conversation.participants.some((p: any) => 
      p.toString() === decoded.userId
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Unauthorized - not a conversation participant' }, { status: 403 });
    }

    // ✅ Create message hash for integrity verification
    const messageHash = MessageEncryption.hashData(content + decoded.userId + Date.now());

    // ✅ Create message with encryption support
    const message = new Message({
      conversationId,
      sender: decoded.userId,
      content: content || '',
      attachment,
      isEncrypted: isEncrypted, // ✅ Track encryption status
      messageHash: messageHash, // ✅ Message integrity hash
      timestamp: new Date(),
    });

    await message.save();
    await message.populate('sender', 'fullName profileImageUrl role');

    // ✅ Update conversation's last message (don't store encrypted content in preview)
    const lastMessageContent = isEncrypted ? '[Encrypted Message]' : (content || '[Attachment]');
    
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: lastMessageContent,
        sender: decoded.userId,
        timestamp: new Date(),
        isEncrypted: isEncrypted, // ✅ Add encryption flag to lastMessage
        messageId: message._id // ✅ Add message reference
      }
    });

    return NextResponse.json({ 
      message: {
        _id: message._id,
        conversationId: message.conversationId,
        sender: message.sender,
        content: message.content,
        attachment: message.attachment,
        isEncrypted: message.isEncrypted,
        messageHash: message.messageHash,
        timestamp: message.timestamp,
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} // ✅ Added missing closing brace for POST function