import fs from 'fs'
import https from 'https'

const downloadImage = async (url: string, path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(path)
    const request = https.get(url, (response) => {
      response.pipe(file)
      // after download completed close filestream
      file.on("finish", () => {
        file.close()
        resolve(true)
      })
      file.on('error', () => {
        resolve(false)
      })
    })
  })
}

export default downloadImage
