import { ImageResponse } from 'next/og'
import { Icons } from '@/icons/icon'

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
  id: Promise<string>
}

export default async function Icon({ id }: Props) {
  const icon = await id
  const sizeMap: Record<string, number> = {
    small: 32,
    large: 192,
    huge: 512,
  }
  const logoMap: Record<
    string,
    { width: number; height: number; radius: number }
  > = {
    small: {
      width: 16,
      height: 22,
      radius: 9,
    },
    large: {
      width: 94,
      height: 132,
      radius: 55,
    },
    huge: {
      width: 250,
      height: 352,
      radius: 150,
    },
  }
  const size = sizeMap[icon]
  const logo = logoMap[icon]

  return new ImageResponse(
    <div
      style={{
        background: '#FFFFFF',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: logo.radius,
      }}
    >
      <Icons.Logo
        style={{ width: logo.width, height: logo.height, color: 'white' }}
      />
    </div>,
    { width: size, height: size },
  )
}
