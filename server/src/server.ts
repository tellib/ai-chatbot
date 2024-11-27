import app from '@/app'
import { APP_PORT } from '@/config/environment'

app.listen(APP_PORT, () => {
  console.log(`Server is running on http://localhost:${APP_PORT}`)
})
