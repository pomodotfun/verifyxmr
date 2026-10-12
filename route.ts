import { isAddress, isTxHash, simulateProof } from '@/lib/monero'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const txid = searchParams.get('txid')?.trim() ?? ''
  const address = searchParams.get('address')?.trim() ?? ''
  const message = searchParams.get('message') ?? ''

  if (!isTxHash(txid) || !isAddress(address)) {
    return Response.json({ error: 'Valid txid and address query parameters are required.' }, { status: 400 })
  }

  const proof = await simulateProof(`${txid}:${address}:${message}`)
  return Response.json({ txid, address, proof })
}
