import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      extractedText = buffer.toString('utf-8');
    } else if (fileName.endsWith('.pdf')) {
      try {
        // Attempt pdf-parse
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text || '';
      } catch (pdfErr) {
        // Fallback: extract ASCII strings from PDF buffer
        const rawString = buffer.toString('binary');
        const matches = rawString.match(/[\x20-\x7E\r\n\t]{4,}/g);
        extractedText = matches ? matches.join('\n') : '';
      }
    } else {
      // Default UTF-8 decode
      extractedText = buffer.toString('utf-8');
    }

    // Clean up excessive whitespace
    extractedText = extractedText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json({
        error: 'Could not extract sufficient text from the file. Please upload a plain text or text-based PDF.',
      }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      fileName,
      text: extractedText,
      characterCount: extractedText.length,
    });
  } catch (error) {
    console.error('File upload extraction error:', error);
    return NextResponse.json({
      error: 'Failed to process uploaded file',
      details: String(error),
    }, { status: 500 });
  }
}
