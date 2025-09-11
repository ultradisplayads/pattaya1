import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { layout } = body;
    
    // For now, just return success - in production you'd save to database
    console.log('User layout received:', layout);
    
    return NextResponse.json({
      success: true,
      message: 'Layout saved successfully',
      data: { layout }
    });
  } catch (error) {
    console.error('Error saving user layout:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to save layout',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Return empty layout for now - in production you'd fetch from database
    return NextResponse.json({
      success: true,
      data: { layout: [] }
    });
  } catch (error) {
    console.error('Error fetching user layout:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch layout',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
