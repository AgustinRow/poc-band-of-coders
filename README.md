# POC

This is a simple proof of concept created quickly. There are endpoints exposed with a simple CRUD to add and view properties. This system was designed for property booking purposes.

It has an authentication system through a one-time use code, so it can also be used by third-party apps if desired.

Currently, authentication is possible by requesting the one-time use code. Authorization has not been implemented yet.

Of course, there are plenty of things to improve, as well the testing. 

###  Requeriments 

- Nodejs v18.12.1
- YARN 

Then in the root of the repo run `yarn turbo build`, this will install  the requeried dependencies

## Project

I use `Clean Architecture` for structure the project. Entities (inner circle) was not implemented. I reach until use cases:

![Clean-Architecture graph](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)


### Tools

It uses `turbo` for building all dependencies.


### Database

sqlite database:  `/storage/local`
ORM: `Sequelize`

Could be easily changed for another DB as it is in external layer and it uses an ORM. 

# Infraestructure

Dockerfile to build the project and it is deployed in AWS EC2 instance. 
Deployment was done manually, I also tried to run a pipeline in github.

# Doc

There is a open api documentation (`open-api/swagger/api.yaml`) as a proof of concept too with the 2 authentication endpoints


