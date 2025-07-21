// ✅ Create/Update src/app/api/reports/route.ts with extensive logging
import { NextRequest, NextResponse } from 'next/server';

console.log('[Report API] Route file loaded');

export async function POST(request: NextRequest) {
  console.log('[Report API] POST function called');
  
  try {
    // Test basic functionality first
    console.log('[Report API] Starting basic test...');
    
    const body = await request.json();
    console.log('[Report API] Request body parsed:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Basic test successful',
      receivedData: body
    }, { status: 200 });
    
  } catch (error) {
    console.error('[Report API] Error in POST function:', error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown'}` },
      { status: 500 }
    );
  }
}

// Add GET method for testing
export async function GET() {
  console.log('[Report API] GET method called');
  return NextResponse.json({ message: 'Reports API is working' });
}