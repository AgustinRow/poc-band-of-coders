console.log(process.env.BASE_URL)

export const IS_LOCAL = process.env.ENVIRONMENT === 'local'
export const BASE_URL = process.env.BASE_URL ?? ''
export const PORT = process.env.PORT ?? 3001
export const RELATIONAL_DB_DIALECT = process.env.RELATIONAL_DB_DIALECT ?? 'sqlite'
export const RELATIONAL_DB_STORAGE_LOCAL = process.env.RELATIONAL_DB_STORAGE_LOCAL ?? ':memory:'
export const RELATIONAL_DB_STORAGE_PRODUCTION = process.env.RELATIONAL_DB_STORAGE_PRODUCTION ?? 'db.sqlite'
export const API_KEY = process.env.API_KEY ?? ''
