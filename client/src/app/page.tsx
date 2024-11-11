import axios from '@/lib/axios'

export default async function Home() {
  let data
  try {
    const response = await axios.get('/')

    console.log(response.data)

    data = response.data
  } catch (error) {
    console.error('Home page error:', error)
  }

  return (
    <main className="mx-auto my-auto p-4">
      <p>{data.message}</p>
    </main>
  )
}
