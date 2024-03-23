import yup from '@project/schema-validation/src/yup'

type SchemasToTypes<T extends { [k: string]: yup.SchemaOf<any> }> = {
  [key in keyof T]: yup.InferType<T[key]>
}

export const propertySchema = {
  createProperty: yup.object({
    apartmentNumber: yup.string().required().strict(),
    complex: yup.string().required().strict(),
    surname: yup.string().required().strict()
  }).noUnknown().strict(),
  getById: yup.object({
    id: yup.string().required().strict()
  }).noUnknown().strict()
}

export type InferTypesOnPropertySectionInputs = SchemasToTypes<typeof propertySchema>
