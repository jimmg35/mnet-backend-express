import sha256 from 'sha256'

export const encodePassword = (password: string) => {
  return sha256.x2(password)
}
