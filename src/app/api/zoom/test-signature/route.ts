import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { meetingNumber, role } = await req.json();

    const sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY;
    const sdkSecret = process.env.ZOOM_SDK_SECRET;

    if (!sdkKey || !sdkSecret) {
      return NextResponse.json(
        { error: 'Missing SDK credentials' },
        { status: 500 }
      );
    }

    const timestamp = new Date().getTime();
    const roleValue = role !== undefined ? role : 0;

    // Step-by-step signature generation with logging
    const payload = `${sdkKey}${meetingNumber}${timestamp}${roleValue}`;
    console.log('Signature payload:', payload);

    const msg = Buffer.from(payload).toString('base64');
    console.log('Base64 message:', msg);

    const hash = crypto
      .createHmac('sha256', sdkSecret)
      .update(msg)
      .digest('base64');
    console.log('HMAC hash:', hash);

    const signaturePayload = `${sdkKey}.${meetingNumber}.${timestamp}.${roleValue}.${hash}`;
    console.log('Signature payload before encoding:', signaturePayload);

    const signature = Buffer.from(signaturePayload).toString('base64');
    console.log('Final signature:', signature);

    // Validate the signature by decoding it back
    try {
      const decoded = Buffer.from(signature, 'base64').toString();
      const parts = decoded.split('.');
      console.log('Decoded signature parts:', parts);

      return NextResponse.json({
        signature,
        timestamp,
        sdkKey,
        debug: {
          payload,
          msg,
          hash,
          signaturePayload,
          decodedParts: parts,
          isValidFormat: parts.length === 5
        }
      });
    } catch (decodeError) {
      console.error('Error decoding signature:', decodeError);
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in signature test:', error);
    return NextResponse.json(
      { error: 'Signature generation failed' },
      { status: 500 }
    );
  }
}
