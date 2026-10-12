import { isAddress, isProofString, isTxHash, isTxKey, simulateVerification } from '@/lib/monero'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const txid = typeof body?.txid === 'string' ? body.txid.trim() : ''
  const address = typeof body?.address === 'string' ? body.address.trim() : ''
  const txKey = typeof body?.txKey === 'string' ? body.txKey.trim() : ''
  const signature = typeof body?.signature === 'string' ? body.signature.trim() : ''

  const errors: string[] = []
  if (!isTxHash(txid)) errors.push('txid must be 64 hexadecimal characters.')
  if (!isAddress(address)) errors.push('address must be a valid Monero address.')
  if (signature ? !isProofString(signature) : !isTxKey(txKey)) {
    errors.push('Provide a valid txKey or an OutProofV2/InProofV2 signature.')
  }
  if (errors.length) return Response.json({ valid: false, errors }, { status: 400 })

  const result = await simulateVerification(`${txid}:${address}:${signature || txKey}`)
  return Response.json({ valid: true, ...result, timestamp: result.timestamp.toISOString() })
}
