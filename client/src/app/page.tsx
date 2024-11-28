import axios from '@/lib/axios'

export default async function Home() {
  let data
  try {
    const response = await axios.get('/')
    data = response.data
  } catch (error) {
    console.error('Home page error', error)
  }

  return (
    <main className="mx-auto my-auto p-4 text-center">
      <p className="text-2xl font-bold">{data.message}</p>
      {data.username ? (
        <p className="text-lg">
          You are logged in as{' '}
          <span className="font-semibold">{data.username}</span>
        </p>
      ) : (
        <p className="text-lg">Log in to continue.</p>
      )}
    </main>
  )
}
