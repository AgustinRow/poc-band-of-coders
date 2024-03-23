import { isUndefined } from 'lodash-es'
import { resolve as resolveTS } from 'ts-node/esm'
import { loadConfig, createMatchPath } from 'tsconfig-paths'
import { pathToFileURL } from 'url'

const { absoluteBaseUrl, paths } = loadConfig()
const matchPath = createMatchPath(absoluteBaseUrl, paths)

export function resolve (specifier, ctx, defaultResolve) {
  const match = matchPath(specifier)

  return !isUndefined(match)
    ? resolveTS(pathToFileURL(`${match}`).href, ctx, defaultResolve)
    : resolveTS(specifier, ctx, defaultResolve)
}

export { load, transformSource } from 'ts-node/esm'
