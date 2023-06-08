import { RoleEnum } from "../../../types/rbac"

export const isRoleCodesValid = (roleCodes: RoleEnum[]) => {
  let isValid = true
  const parsedRoleCodes = JSON.parse(roleCodes as any as string)
  for (let i = 0; i < parsedRoleCodes.length; i++) {
    isValid = Object.values(RoleEnum).includes(parsedRoleCodes[i])
    if (!isValid) return { parsedRoleCodes, isValid }
  }
  return { parsedRoleCodes, isValid }
}