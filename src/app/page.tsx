import { Layout } from '@/components/layout'
import { Section } from '@/components/section'

export default function Home() {
  return (
    <Layout>
      <Section>
        <div className='flex items-center justify-center py-10'>
          <span className='text-lg leading-5.25 text-black'>
            Inca Trail Operator Official Site – Browse and book over 2,000
            things to do with Inca Trail Operator. Plus, we offer free
            cancellation and flexible payment options for stress-free travel.
          </span>
        </div>
      </Section>
    </Layout>
  )
}
