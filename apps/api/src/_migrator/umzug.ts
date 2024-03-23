import { Umzug, SequelizeStorage } from 'umzug'
import globby from 'globby'

import { Sequelize } from 'sequelize'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = fileURLToPath(new URL('.', import.meta.url))

// TODO: Prepare for cloud environment
const sequelize = new Sequelize({
  storage: 'storage/local/database.sqlite',
  dialect: 'sqlite',
  define: {
    freezeTableName: true
  }
})

const migrationFiles = globby.sync([
  path.join(dirname, '..', '**', '_migrations', '*.ts')
])
const seederFiles = globby.sync([
  path.join(dirname, '..', '**', '_seeders', '*.ts')
])

const migrations = await Promise.all(
  migrationFiles.map(async (file) => {
    const { default: migration } = await import(file)

    return {
      ...migration,
      name: path.basename(file)
    }
  })
)

const seeders = await Promise.all(
  seederFiles.map(async (file) => {
    const { default: seeder } = await import(file)

    return {
      ...seeder,
      name: path.basename(file)
    }
  })
)

export const migrator = new Umzug({
  migrations: context => migrations.map(migration => ({
    name: migration.name,
    up: () => migration.up(context, Sequelize),
    down: () => migration.down(context, Sequelize)
  })),
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: '_migrationsMeta'
  }),
  logger: console
})

export type Migration = typeof migrator._types.migration

export const seeder = new Umzug({
  migrations: context => seeders.map(seeder => ({
    name: seeder.name,
    up: () => seeder.up(context, Sequelize),
    down: () => seeder.down(context, Sequelize)
  })),
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    modelName: '_seedersMeta'
  }),
  logger: console
})

export type Seeder = typeof seeder._types.migration
