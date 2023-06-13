
export enum UserSex {
  Female = 'sex:female',
  Male = 'sex:male',
  System = 'sex:system'
}

export enum RoleEnum {
  General = 'user:general',
  Admin = 'user:admin',
  Root = 'user:root'
}

export enum ApiRightEnum {
  UserPasswordReset = 'api:user:password:reset',
  UserList = 'api:user:list',
  UserProfileList = 'api:user:profile:list',
  UserProfileEdit = 'api:user:profile:edit',
  //
  RoleList = 'api:role:list',
  RoleProfileList = 'api:role:profile:list',
  RoleApiEdit = 'api:role:api:edit',
  RolePageEdit = 'api:role:page:edit',
}

export enum PageRightEnum {
  Home = '/'
}
