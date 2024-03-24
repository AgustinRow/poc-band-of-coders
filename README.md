# POC

###  Requeriments 

- Nodejs v18.12.1
- YARN 

Then in the root of the repo run `yarn turbo build`, this will install  the requeried dependencies

## Project

This is a POC of a booking CRUD system with an authentication method using a single code and API_KEY

I use `Clean Architecture` for structure the project. Entities (inner circle) was not implemented. I reach until use cases:

![Clean-Architecture graph](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)


### Tools

It uses `turbo` for building all dependencies.


### Database

sqlite database:  `/storage/local`
ORM: `Sequelize`

Could be easily changed for another DB as it is in external layer and it uses an ORM. 




