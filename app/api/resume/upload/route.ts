import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session?.user_id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    let extractedText = ''

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text based on file type
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // Parse PDF using pdf2json
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const PDFParser = require('pdf2json')
      
      const pdfParser = new PDFParser(null, 1)
      
      // Extract text from PDF
      extractedText = await new Promise<string>((resolve, reject) => {
        pdfParser.on('pdfParser_dataError', (err: Error) => {
          reject(new Error('Failed to parse PDF: ' + err.message))
        })
        
        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
          try {
            // Extract text from all pages
            const textParts: string[] = []
            if (pdfData.Pages) {
              pdfData.Pages.forEach((page: any) => {
                if (page.Texts) {
                  page.Texts.forEach((textItem: any) => {
                    if (textItem.R) {
                      textItem.R.forEach((run: any) => {
                        if (run.T) {
                          // Decode URI-encoded text
                          textParts.push(decodeURIComponent(run.T))
                        }
                      })
                    }
                  })
                }
              })
            }
            resolve(textParts.join(' '))
          } catch (error) {
            reject(error)
          }
        })
        
        pdfParser.parseBuffer(buffer)
      })
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      // Parse DOCX - use require for CommonJS compatibility
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mammoth = require('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Please upload PDF or DOCX.' },
        { status: 400 }
      )
    }

    if (!extractedText || extractedText.trim().length < 50) {
      return NextResponse.json(
        { success: false, error: 'Could not extract enough text from the file.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
    })
  } catch (error) {
    console.error('File upload error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process file',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 }
    )
  }
}
