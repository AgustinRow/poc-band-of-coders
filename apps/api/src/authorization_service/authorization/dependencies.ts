import { ContainerModule, decorate, injectable } from 'inversify'
import AuthorizationUseCases from './use_cases/authorization'

decorate(injectable(), AuthorizationUseCases)

const dependencyContainer = new ContainerModule((bind) => {
  bind<AuthorizationUseCases>('AuthorizationUseCases').to(AuthorizationUseCases)
})

export default dependencyContainer
