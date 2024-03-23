import path from 'path'
import globby from 'globby'
import { ContainerModule } from 'inversify'
import { startUpLog } from '~/utils/startup_log'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(new URL('.', import.meta.url))

const dependenciesPaths = globby.sync([
  path.join(dirname, '..', '**', 'dependencies.(t|j)s')
])
const dependencies: ContainerModule[] = []

startUpLog('Dependencies')

await Promise.all(
  dependenciesPaths.map(async file => {
    startUpLog(`  Loading ${file}`)
    const start = Date.now()
    const { default: defaultExport } = await import(path.resolve(process.cwd(), file))
    dependencies.push(defaultExport)
    startUpLog(`  (${((Date.now() - start) / 1000).toFixed(3)}s) Finished loading ${file}`)
  })
)

export default dependencies
