import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

const ACCEPTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

const MAX_SIZE_BYTES =
  parseInt(process.env.UPLOAD_MAX_SIZE_MB ?? '10', 10) * 1024 * 1024

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? '/uploads'

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const userId = token?.sub

  if (!userId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } },
      { status: 401 }
    )
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json(
      { error: { code: 'INVALID_FORM', message: 'Données de formulaire invalides' } },
      { status: 400 }
    )
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: { code: 'MISSING_FILE', message: 'Le champ file est requis' } },
      { status: 400 }
    )
  }

  // Validate MIME type
  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_TYPE',
          message: 'Type de fichier non accepté. Types acceptés : JPEG, PNG, WebP, GIF',
        },
      },
      { status: 422 }
    )
  }

  // Validate size
  if (file.size > MAX_SIZE_BYTES) {
    const maxMb = process.env.UPLOAD_MAX_SIZE_MB ?? '10'
    return NextResponse.json(
      {
        error: {
          code: 'FILE_TOO_LARGE',
          message: `Le fichier dépasse la taille maximale autorisée (${maxMb} MB)`,
        },
      },
      { status: 422 }
    )
  }

  // Read file bytes and re-validate MIME via magic bytes
  const arrayBuffer = await file.arrayBuffer()
  const inputBuffer = Buffer.from(arrayBuffer)

  // Ensure upload directory exists
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const uuid = randomUUID()
  const outputFilename = `${timestamp}-${uuid}.webp`
  const outputPath = path.join(UPLOAD_DIR, outputFilename)

  // Process image with sharp: resize to max 1920px wide, output WebP quality 80
  let outputInfo: sharp.OutputInfo
  try {
    const pipeline = sharp(inputBuffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })

    outputInfo = await pipeline.toFile(outputPath)
  } catch {
    return NextResponse.json(
      { error: { code: 'PROCESSING_ERROR', message: "Erreur lors du traitement de l'image" } },
      { status: 500 }
    )
  }

  const url = `/uploads/${outputFilename}`

  return NextResponse.json(
    {
      data: {
        url,
        width: outputInfo.width,
        height: outputInfo.height,
        size: outputInfo.size,
      },
    },
    { status: 201 }
  )
}
