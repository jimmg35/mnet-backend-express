import { Factory, Seeder } from 'typeorm-seeding'
import { Connection, In } from 'typeorm'
// import apiRights from '../data/apiRights.json'
// import pageRights from '../data/pageRights.json'
import roles from '../data/roles.json'
import users from '../data/users.json'
import { Role } from '../../entity/credential/role.entity'
import { ApiRight } from '../../entity/credential/apiright.entity'
import { PageRight } from '../../entity/credential/pageright.entity'
import { ApiRightEnum, PageRightEnum, RoleEnum, UserSex } from '../../types/rbac'
import { User } from '../../entity/credential/user.entity'
import sha256 from 'sha256'
import uniqid from 'uniqid'

export default class CreateRBAC implements Seeder {
  public async run (factory: Factory, connection: Connection): Promise<any> {


    // seed api right
    const apiRightKeys = Object.keys(ApiRightEnum)
    const apiRightValues = Object.values(ApiRightEnum)
    const apiRightEntities: ApiRight[] = []
    const apiRightRepo = connection.getRepository(ApiRight)
    const [_, apiRightCount] = await apiRightRepo.findAndCount()
    if (apiRightCount === 0) {
      for (let i = 0; i < apiRightValues.length; i++) {
        const key = apiRightKeys[i]
        const value = apiRightValues[i]
        const apiRight = new ApiRight()
        apiRight.name = key
        apiRight.code = value
        apiRightEntities.push(apiRight)
      }
    } else {
      console.log('\n- Already has data in it, stop seeding')
    }
    await apiRightRepo.insert(apiRightEntities)


    // seed page right
    const pageRightKeys = Object.keys(PageRightEnum)
    const pageRightValues = Object.values(PageRightEnum)
    const pageRightEntities: PageRight[] = []
    const pageRightRepo = connection.getRepository(PageRight)
    const [__, pageRightCount] = await pageRightRepo.findAndCount()
    if (pageRightCount === 0) {
      for (let i = 0; i < pageRightValues.length; i++) {
        const key = pageRightKeys[i]
        const value = pageRightValues[i]
        const pageRight = new PageRight()
        pageRight.name = key
        pageRight.code = value
        pageRightEntities.push(pageRight)
      }
    } else {
      console.log('\n- Already has data in it, stop seeding')
    }
    await pageRightRepo.insert(pageRightEntities)


    // seed roles
    const roleEntities: Role[] = []
    const roleRepo = connection.getRepository(Role)
    const [___, roleCount] = await roleRepo.findAndCount()
    if (roleCount === 0) {
      for (let i = 0; i < roles.length; i++) {
        const r = roles[i]
        const roleEntity = new Role()
        roleEntity.name = r.name
        roleEntity.code = RoleEnum[r.id as keyof typeof RoleEnum]
        roleEntities.push(roleEntity)
      }
      await roleRepo.insert(roleEntities)

      for (let i = 0; i < roles.length; i++) {
        const r = roles[i]
        const apiRights = await apiRightRepo.find({
          where: {
            code: In([...r.apiRights])
          }
        })
        const pageRights = await pageRightRepo.find({
          where: {
            code: In([...r.pageRights])
          }
        })
        roleEntities[i].apirights = apiRights
        roleEntities[i].pagerights = pageRights
      }
      await roleRepo.save(roleEntities)

    } else {
      console.log('\n- Already has data in it, stop seeding')
    }

    // seed users
    const sexValues = Object.values(UserSex)
    const userEntities: User[] = []
    const userRepo = connection.getRepository(User)
    const [____, userCount] = await userRepo.findAndCount()
    if (userCount === 0) {
      for (let i = 0; i < users.length; i++) {
        const u = users[i]
        const userEntity = new User()
        userEntity.alias = u.alias
        userEntity.email = u.email
        userEntity.sex = u.sex as UserSex
        userEntity.password = sha256.x2(u.password)
        userEntity.verifyCode = uniqid()
        userEntity.isVerified = true
        userEntities.push(userEntity)
      }
      await userRepo.insert(userEntities)

      for (let i = 0; i < users.length; i++) {
        const u = users[i]
        const userRoles = await roleRepo.find({
          where: {
            code: In([...u.roles])
          }
        })
        userEntities[i].roles = userRoles
      }
      await userRepo.save(userEntities)

    } else {
      console.log('\n- Already has data in it, stop seeding')
    }






    // // seed api right
    // const apiRightEntities: ApiRight[] = []
    // const apiRightRepo = connection.getRepository(ApiRight)
    // const [_, apiRightCount] = await apiRightRepo.findAndCount()
    // if (apiRightCount === 0) {
    //   for (let i = 0; i < apiRights.length; i++) {
    //     const a = apiRights[i]
    //     const apiRight = new ApiRight()
    //     apiRight.name = a.name
    //     apiRight.code = ApiRightEnum[a.name as keyof typeof ApiRightEnum]
    //     apiRightEntities.push(apiRight)
    //   }
    // } else {
    //   console.log('\n- Already has data in it, stop seeding')
    // }
    // await apiRightRepo.insert(apiRightEntities)


    // // seed page right
    // const pageRightEntities: PageRight[] = []
    // const pageRightRepo = connection.getRepository(PageRight)
    // const [__, pageRightCount] = await pageRightRepo.findAndCount()
    // if (pageRightCount === 0) {
    //   for (let i = 0; i < pageRights.length; i++) {
    //     const p = pageRights[i]
    //     const pageRight = new PageRight()
    //     console.log(PageRightEnum[p.name as keyof typeof PageRightEnum])
    //     pageRight.name = p.name
    //     pageRight.code = PageRightEnum[p.name as keyof typeof PageRightEnum]
    //     pageRightEntities.push(pageRight)
    //   }
    // } else {
    //   console.log('\n- Already has data in it, stop seeding')
    // }
    // await pageRightRepo.insert(pageRightEntities)


    // // seed roles
    // const roleEntities: Role[] = []
    // const roleRepo = connection.getRepository(Role)
    // const [___, roleCount] = await roleRepo.findAndCount()
    // if (roleCount === 0) {
    //   for (let i = 0; i < roles.length; i++) {
    //     const r = roles[i]
    //     const roleEntity = new Role()
    //     roleEntity.name = r.name
    //     roleEntity.code = RoleEnum[r.id as keyof typeof RoleEnum]
    //     roleEntities.push(roleEntity)
    //   }
    //   await roleRepo.insert(roleEntities)

    //   for (let i = 0; i < roles.length; i++) {
    //     const r = roles[i]
    //     const apiRights = await apiRightRepo.find({
    //       where: {
    //         code: In([...r.apiRights])
    //       }
    //     })
    //     const pageRights = await pageRightRepo.find({
    //       where: {
    //         code: In([...r.pageRights])
    //       }
    //     })
    //     roleEntities[i].apirights = apiRights
    //     roleEntities[i].pagerights = pageRights
    //   }
    //   await roleRepo.save(roleEntities)

    // } else {
    //   console.log('\n- Already has data in it, stop seeding')
    // }


    // // seed users
    // const userEntities: User[] = []
    // const userRepo = connection.getRepository(User)
    // const [____, userCount] = await userRepo.findAndCount()
    // if (userCount === 0) {
    //   for (let i = 0; i < users.length; i++) {
    //     const u = users[i]
    //     const userEntity = new User()
    //     userEntity.alias = u.alias
    //     userEntity.email = u.email
    //     userEntity.password = sha256.x2(u.password)
    //     userEntities.push(userEntity)
    //   }
    //   await userRepo.insert(userEntities)

    //   for (let i = 0; i < users.length; i++) {
    //     const u = users[i]
    //     const userRoles = await roleRepo.find({
    //       where: {
    //         code: In([...u.roles])
    //       }
    //     })
    //     userEntities[i].roles = userRoles
    //   }
    //   await userRepo.save(userEntities)

    // } else {
    //   console.log('\n- Already has data in it, stop seeding')
    // }




  }
}
