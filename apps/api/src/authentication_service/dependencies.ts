import { ContainerModule, decorate, injectable } from 'inversify'
import AuthenticationControllers from './authentication/controllers/authentication'
import AuthenticationUseCases from './authentication/use_cases/authentication'
import AuthenticationPresenters from './authentication/presenters/authentication'
import { SequelizeAuthenticationSingleUseCodeRepository } from './authentication/repositories/authentication'
import { IAuthenticationSingleUseCodeRepository } from './authentication/use_cases/interfaces'
import { IAuthenticationProvider } from './3rd_party/services'
import AuthenticationProvider from './3rd_party/jwt/auth_provider'

decorate(injectable(), AuthenticationUseCases)
decorate(injectable(), AuthenticationControllers)
decorate(injectable(), AuthenticationPresenters)
decorate(injectable(), SequelizeAuthenticationSingleUseCodeRepository)
decorate(injectable(), AuthenticationProvider)

const dependencyContainer = new ContainerModule((bind) => {
  bind<IAuthenticationProvider>('IAuthenticationProvider').to(AuthenticationProvider)
  bind<AuthenticationControllers>('AuthenticationControllers').to(AuthenticationControllers)
  bind<AuthenticationUseCases>('AuthenticationUseCases').to(AuthenticationUseCases)
  bind<AuthenticationPresenters>('AuthenticationPresenters').to(AuthenticationPresenters)
  bind<IAuthenticationSingleUseCodeRepository>('IAuthenticationSingleUseCodeRepository').to(SequelizeAuthenticationSingleUseCodeRepository)
})

export default dependencyContainer
