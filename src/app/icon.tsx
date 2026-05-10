import { ImageResponse } from 'next/og'

export async function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 32, height: 32 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 192, height: 192 },
      id: 'large',
    },
    {
      contentType: 'image/png',
      size: { width: 512, height: 512 },
      id: 'huge',
    },
  ]
}

interface Props {
  id: string
}

export default function Icon({ id }: Props) {
  const sizeMap: Record<string, number> = {
    small: 32,
    large: 192,
    huge: 512,
  }
  const size = sizeMap[id] || 32

  return new ImageResponse(
    <img
      style={{ width: '100%', height: '100%' }}
      src={`${process.env.APP_URL}/logos/icon.png`}
      alt='Incatrailoperator'
    />,
    { width: size, height: size },
  )
}
