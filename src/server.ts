import { app } from './app'
import { env } from './env'

const port = env.PORT

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log(`Server is running at http://localhost:${port}\n`)
    console.log(`Documentation is available at http://localhost:${port}/docs`)
  })
