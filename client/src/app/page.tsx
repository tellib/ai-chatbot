import axios from '@/lib/axios'

export default async function Home() {
  const { message } = await axios
    .get('/')
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error('Home page error', error)
    })

  return (
    <main className="mx-auto my-auto p-4 text-center">
      <p className="text-2xl font-bold">{message}</p>
    </main>
  )
}
