import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <img
      style={{ width: '100%', height: '100%' }}
      src={`${process.env.APP_URL}/logos/icon.png`}
      alt='Incatrailoperator'
    />,
    {
      ...size,
    },
  )
}
