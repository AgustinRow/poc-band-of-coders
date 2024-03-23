import { isUndefined } from 'lodash-es'
import { loadConfig, createMatchPath } from 'tsconfig-paths'
import { pathToFileURL } from 'url'

process.env.TS_NODE_BASEURL = './dist'

const { absoluteBaseUrl, paths } = loadConfig()
const matchPath = createMatchPath(absoluteBaseUrl, paths)

export function resolve (specifier, ctx, defaultResolve) {
  const match = matchPath(specifier)

  return !isUndefined(match)
    ? defaultResolve(pathToFileURL(`${match}`).href, ctx, defaultResolve)
    : defaultResolve(specifier, ctx, defaultResolve)
}

export function load (url, context, defaultLoad) {
  return defaultLoad(url, context, defaultLoad)
}

export function transformSource (source, context, defaultTransformSource) {
  return defaultTransformSource(source, context, defaultTransformSource)
}
