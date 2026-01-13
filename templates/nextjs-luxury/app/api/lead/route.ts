import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['buyer', 'seller']),
  budget: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Log to console (in production, you'd send to email service, CRM, etc.)
    console.log('New lead submission:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
    })

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: process.env.CONTACT_EMAIL,
    //   subject: `New Lead: ${validatedData.name}`,
    //   html: formatEmail(validatedData),
    // })

    return NextResponse.json(
      { success: true, message: 'Thank you for your inquiry. We will be in touch shortly.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Error processing lead:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
