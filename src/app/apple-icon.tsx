import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }

export const contentType = 'image/svg+xml'

export default function AppleIcon() {
  return new ImageResponse(
    <img
      style={{ width: '100%', height: '100%' }}
      src={`${process.env.APP_URL}/logos/logo.svg`}
      alt='Incatrailoperator'
    />,
    {
      ...size,
    },
  )
}
