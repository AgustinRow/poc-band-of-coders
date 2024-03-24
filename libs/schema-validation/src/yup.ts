import { isNil } from 'lodash-es'
import * as yup from 'yup'
import { isValidPhoneNumber } from 'libphonenumber-js'
import YupPassword from 'yup-password'
import Reference from 'yup/lib/Reference'
YupPassword(yup)

yup.addMethod<yup.BaseSchema>(yup.string, 'isValidPhoneNumber', function (
  this: yup.BaseSchema
) {
  return this.test({
    test: (value?: string) => {
      if (isNil(value)) {
        return true
      }
      return isValidPhoneNumber(value)
    },
    message: 'Invalid phone number'
  })
})

yup.addMethod<yup.BaseSchema>(yup.string, 'fieldsMatch', function (ref: Reference<string>, message: string) {
  return yup.mixed().test({
    name: 'fieldsMatch',
    exclusive: false,
    message,
    params: {
      reference: ref.path
    },
    test: function (value: any) {
      return value === this.resolve(ref)
    }
  })
})

declare module 'yup' {
  interface StringSchema {
    isValidPhoneNumber: () => StringSchema
    fieldsMatch: (ref: Reference<string>, message: string) => StringSchema
  }
}

export default yup
