import { NextResponse } from 'next/server';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const inputPath = path.join(os.tmpdir(), `${Date.now()}-${file.name}`);
    const outputPath = inputPath.replace(/\.[^/.]+$/, '.opus');

    fs.writeFileSync(inputPath, buffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioCodec('libopus')
        .audioBitrate('64k')
        .save(outputPath)
        .on('end', resolve)
        .on('error', reject);
    });

    const outputBuffer = fs.readFileSync(outputPath);

    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return new Response(outputBuffer, {
      headers: {
        'Content-Type': 'audio/ogg',
        'Content-Disposition': 'attachment; filename="audio.opus"',
      },
    });
  } catch (err) {
    console.error('API converter error:', err);
    return NextResponse.json({ error: 'Erro ao converter' }, { status: 500 });
  }
}
