import yup from '@project/schema-validation/src/yup'

type SchemasToTypes<T extends { [k: string]: yup.SchemaOf<any> }> = {
  [key in keyof T]: yup.InferType<T[key]>
}

export const authenticationSchema = {
  getSingleUseCode: yup.object({
    apiKey: yup.string().required().strict(),
    complex: yup.string().required().strict()
  }).noUnknown().strict(),
  validateSingleUseCode: yup.object({
    singleUseCode: yup.string().required().strict()
  }).noUnknown().strict()
}

export type InferTypesOnPropertySectionInputs = SchemasToTypes<typeof authenticationSchema>
