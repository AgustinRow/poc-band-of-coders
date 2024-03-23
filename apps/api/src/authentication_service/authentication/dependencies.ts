import { ContainerModule, decorate, injectable } from 'inversify'
import AuthenticationControllers from './controllers/authentication'
import AuthenticationUseCases from './use_cases/authentication'
import AuthenticationPresenters from './presenters/authentication'
import { SequelizeAuthenticationSingleUseCodeRepository } from './repositories/authentication'
import { IAuthenticationSingleUseCodeRepository } from './use_cases/interfaces'

decorate(injectable(), AuthenticationUseCases)
decorate(injectable(), AuthenticationControllers)
decorate(injectable(), AuthenticationPresenters)
decorate(injectable(), SequelizeAuthenticationSingleUseCodeRepository)

const dependencyContainer = new ContainerModule((bind) => {
  bind<AuthenticationControllers>('AuthenticationControllers').to(AuthenticationControllers)
  bind<AuthenticationUseCases>('AuthenticationUseCases').to(AuthenticationUseCases)
  bind<AuthenticationPresenters>('AuthenticationPresenters').to(AuthenticationPresenters)
  bind<IAuthenticationSingleUseCodeRepository>('IAuthenticationSingleUseCodeRepository').to(SequelizeAuthenticationSingleUseCodeRepository)
})

export default dependencyContainer
