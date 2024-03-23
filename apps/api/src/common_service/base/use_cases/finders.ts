import mapToIdList from '../../../utils/map_to_id_list'
import { IRepositoryFinders, IUseCaseFinders } from './types'

export default abstract class UseCasesFinders<T extends {id?: string}, F = unknown, O = unknown> implements IUseCaseFinders<T, F> {
  constructor (
    protected readonly repository: IRepositoryFinders<T & {id: string}, F>
  ) {
    this.findAll = this.findAll.bind(this)
    this.findById = this.findById.bind(this)
  }

  async findById (id: string): ReturnType<IUseCaseFinders<T, F>['findById']> {
    const item = await this.repository.findById(id)
    return item
  }

  async findAll (filter?: F, order?: O, config?: any): ReturnType<IUseCaseFinders<T, F>['findAll']> {
    const items = await this.repository.findAll(filter)
    return items.mapOk(mapToIdList)
  }
}
