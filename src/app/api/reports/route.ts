// ✅ src/app/api/reports/route.ts - Complete implementation
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  console.log('[Report API] POST request received');
  
  try {
    const body = await request.json();
    const { reporteeId, reportType, description, chatReferenceId } = body;
    
    console.log('[Report API] Request body:', {
      reporteeId,
      reportType,
      descriptionLength: description?.length,
      chatReferenceId
    });
    
    // Validate required fields
    if (!reporteeId || !reportType || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: reporteeId, reportType, and description are required' },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // JWT verification
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('[Report API] JWT verified for user:', decoded.userId);
    } catch (jwtError) {
      console.error('[Report API] JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Prevent self-reporting
    if (decoded.userId === reporteeId) {
      return NextResponse.json({ error: 'You cannot report yourself' }, { status: 400 });
    }

    // Database connection
    try {
      const connectDB = (await import('@/lib/db')).default;
      await connectDB();
      console.log('[Report API] Database connected successfully');
    } catch (dbError) {
      console.error('[Report API] Database connection error:', dbError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    // Direct model imports (your current approach)
    try {
      const User = (await import('@/models/User')).default;
      const Report = (await import('@/models/report')).default;
      const mongoose = (await import('mongoose')).default;
      
      console.log('[Report API] Models imported successfully');
      
      // Validate ObjectIds
      if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
        return NextResponse.json({ error: 'Invalid reporter ID format' }, { status: 400 });
      }
      
      if (!mongoose.Types.ObjectId.isValid(reporteeId)) {
        return NextResponse.json({ error: 'Invalid reportee ID format' }, { status: 400 });
      }
      
      // Look up users
      console.log('[Report API] Looking up users...');
      const [reporter, reportee] = await Promise.all([
        User.findById(decoded.userId),
        User.findById(reporteeId)
      ]);
      
      console.log('[Report API] User lookup results:', {
        reporterFound: !!reporter,
        reporteeFound: !!reportee,
        reporterName: reporter?.fullName,
        reporteeName: reportee?.fullName
      });
      
      if (!reporter) {
        return NextResponse.json({ error: 'Reporter not found' }, { status: 404 });
      }
      
      if (!reportee) {
        return NextResponse.json({ error: 'Reported user not found' }, { status: 404 });
      }
      
      // Create the report
      console.log('[Report API] Creating report...');
      const newReport = new Report({
        reporterId: decoded.userId,
        reporterName: reporter.fullName,
        reporteeId: reporteeId,
        reporteeName: reportee.fullName,
        reportType,
        description: description.trim(),
        chatReferenceId: chatReferenceId || null,
        status: 'Pending',
        createdAt: new Date()
      });

      const savedReport = await newReport.save();
      console.log('[Report API] Report created successfully:', savedReport._id);

      return NextResponse.json({
        success: true,
        message: 'Report submitted successfully',
        reportId: savedReport._id
      }, { status: 201 });
      
    } catch (modelError) {
      console.error('[Report API] Model operation failed:', {
        name: modelError instanceof Error ? modelError.name : 'Unknown',
        message: modelError instanceof Error ? modelError.message : 'Unknown error'
      });
      
      return NextResponse.json(
        { 
          error: 'Model operation failed', 
          details: modelError instanceof Error ? modelError.message : 'Unknown model error'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[Report API] General error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Reports API is working',
    timestamp: new Date().toISOString()
  });
}