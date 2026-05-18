import { ImageResponse } from 'next/og'
import { Icons } from '@/icons/icon'

export const size = { width: 180, height: 180 }

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: '#FFFFFF',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
      }}
    >
      <Icons.Logo style={{ width: 88, height: 124, color: 'white' }} />
    </div>,
    {
      ...size,
    },
  )
}
