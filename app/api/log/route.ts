import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level = 'log', message, data } = body;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    // Log to terminal
    switch (level) {
      case 'error':
        console.error(logMessage, data ? JSON.stringify(data, null, 2) : '');
        break;
      case 'warn':
        console.warn(logMessage, data ? JSON.stringify(data, null, 2) : '');
        break;
      default:
        console.log(logMessage, data ? JSON.stringify(data, null, 2) : '');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[LOG API ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to log' }, { status: 500 });
  }
}

