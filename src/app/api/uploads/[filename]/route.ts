import { type NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? '/uploads'

// Only allow safe filenames: alphanumeric, hyphens, underscores, dots
const SAFE_FILENAME_RE = /^[\w\-]+\.[\w]+$/

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params

  if (!SAFE_FILENAME_RE.test(filename)) {
    return NextResponse.json(
      { error: { code: 'INVALID_FILENAME', message: 'Nom de fichier invalide' } },
      { status: 400 }
    )
  }

  const filePath = path.join(UPLOAD_DIR, filename)

  // Prevent path traversal
  if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Accès refusé' } },
      { status: 403 }
    )
  }

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Fichier introuvable' } },
      { status: 404 }
    )
  }

  const buffer = await readFile(filePath)
  const ext = path.extname(filename).toLowerCase().slice(1)

  const MIME_MAP: Record<string, string> = {
    webp: 'image/webp',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
  }

  const contentType = MIME_MAP[ext] ?? 'application/octet-stream'

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
