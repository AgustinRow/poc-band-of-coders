import './validate_constants'
import 'reflect-metadata'
import cors from 'cors'
import express, { json, text } from 'express'
import { Container } from 'inversify'
import { InversifyExpressServer } from 'inversify-express-utils'
import './setup_express_routes'
import './setup_listeners'
import dependencies from './setup_module_dependencies'
import applyRequestNamespace from './3rd_party/cls_namespaces/express_middleware'
import storeAccessTokenInAuthHandler, { authenticationMiddleware } from './3rd_party/authentication/express_middleware'
import { IDBBuilder } from './3rd_party/sequelize'
import { PORT } from './constants_common'

(async () => {
  const corsOriginsRegex = /^\b$/
  const port = PORT
  const app = express()

  app.set('trust proxy', 1)
  app.use(cors({
    origin: corsOriginsRegex,
    credentials: true
  }))
  app.use(json())
  app.use(text({ type: 'text/plain' }))

  app.use(applyRequestNamespace)
  app.use(storeAccessTokenInAuthHandler)
  app.use(authenticationMiddleware)

  const dependencyContainer = new Container({
    skipBaseClassChecks: true
  })

  dependencyContainer.load(...dependencies)

  const dbBuilderResult = await dependencyContainer.get<IDBBuilder>('IDBBuilder').build()
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (dbBuilderResult.isErr()) throw new Error(dbBuilderResult.error)

  const server = new InversifyExpressServer(dependencyContainer, null, null, app)
  server.build().listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`)
    console.log(`Accepting requests whose origin matches: ${corsOriginsRegex.toString()}`)
  })
})().catch(console.error)
