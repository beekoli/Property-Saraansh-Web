import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, slug } = body

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    if (!slug) {
      return NextResponse.json({ message: 'Missing slug' }, { status: 400 })
    }

    revalidatePath(`/properties/${slug}`)
    revalidatePath('/properties')

    return NextResponse.json({
      revalidated: true,
      path: `/properties/${slug}`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    )
  }
}
