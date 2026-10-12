import { findToken, pumpFunUrl } from '@/lib/tokens'

export async function GET(_request: Request, { params }: { params: Promise<{ ca: string }> }) {
  const { ca } = await params
  const token = findToken(ca)
  if (!token) return Response.json({ error: 'Token not found.' }, { status: 404 })
  return Response.json({ ...token, url: pumpFunUrl(token.ca) })
}
