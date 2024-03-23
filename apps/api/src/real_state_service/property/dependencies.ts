import { ContainerModule, decorate, injectable } from 'inversify'
import PropertyControllers from './controllers/property'
import PropertyUseCases from './use_cases/property'
import PropertyPresenters from './presenters/property'
import { SequelizePropertyRepository } from './repositories/property'
import { IPropertyRepository } from './use_cases/interfaces'

decorate(injectable(), PropertyUseCases)
decorate(injectable(), PropertyControllers)
decorate(injectable(), PropertyPresenters)
decorate(injectable(), SequelizePropertyRepository)

const dependencyContainer = new ContainerModule((bind) => {
  bind<PropertyControllers>('PropertyControllers').to(PropertyControllers)
  bind<PropertyUseCases>('PropertyUseCases').to(PropertyUseCases)
  bind<PropertyPresenters>('PropertyPresenters').to(PropertyPresenters)
  bind<IPropertyRepository>('IPropertyRepository').to(SequelizePropertyRepository)
})

export default dependencyContainer
