import { isBoolean, isEmpty, isNumber } from 'lodash-es'
import * as constants_common from './constants_common'
import { startUpLog } from '~/utils/startup_log'

const OPTIONAL_CONSTANTS: string[] = [
]
const undefinedConstants: string[] = []

function validateConstantGroup (groupName: string, constants: any): void {
  startUpLog(`  ${groupName} constants group started`)
  for (const [constant, value] of Object.entries(constants)) {
    if (OPTIONAL_CONSTANTS?.includes(constant)) continue

    if (isEmpty(value) && !isNumber(value) && !isBoolean(value)) {
      startUpLog(`      - ${constant} is undefined`)
      undefinedConstants.push(constant)
    } else {
      startUpLog(`    - ${constant} ok`)
    }
  }
}

startUpLog('Validating constants...')

validateConstantGroup('COMMON', constants_common)

if (!isEmpty(undefinedConstants)) {
  throw new Error(
    'Cannot start server with undefined constants:\n' +
    undefinedConstants.map(constant => `\t- ${constant}`).join('\n')
  )
}
