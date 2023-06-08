
export type ImageType = 'png' | 'jpg'

const scanImageUrl = (url: string) => {
  const pngPattern = /(https?:\/\/.*\.(?:png))/i
  const jpgPattern = /(https?:\/\/.*\.(?:jpg))/i
  const isImageUrl = pngPattern.test(url) || jpgPattern.test(url)
  let imageType: ImageType = 'jpg'
  if (pngPattern.test(url)) imageType = 'png'
  return { isImageUrl, imageType }
}

export default scanImageUrl
