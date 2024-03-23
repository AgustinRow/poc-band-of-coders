
import path from 'path'
import globby from 'globby'
import { startUpLog } from '~/utils/startup_log'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(new URL('.', import.meta.url))

const resolversPaths = globby.sync([
  path.join(dirname, '..', '**', '*.express.(t|j)s')
])

startUpLog('Express routes')

await Promise.all(
  resolversPaths.map(async file => {
    startUpLog(`  Loading ${file}`)
    const start = Date.now()
    await import(path.resolve(process.cwd(), file))
    startUpLog(`  (${((Date.now() - start) / 1000).toFixed(3)}s) Finished loading ${file}`)
  })
)
