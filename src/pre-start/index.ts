import "reflect-metadata"
import path from 'path'
import dotenv from 'dotenv'
import commandLineArgs from 'command-line-args'
import fs from 'fs'
import scanImgUrl from "../lib/utility/scanImgUrl"

const initStaticDir = (staticPath: string | undefined) => {
  if (!staticPath) return
  const staticFilePath = path.join(__dirname, `..${staticPath}`)
  if (!fs.existsSync(staticFilePath)) {
    fs.mkdirSync(staticFilePath)
  }
  // const aa = '雲森瀑布\n圖片來源：新北市觀光旅遊網\nhttps://newtaipei.travel/content/images/attractions/2185/1024x768_20130829162820.jpg'
  // const { isImageUrl, imageType } = scanImgUrl(aa)
  // console.log(isImageUrl)
  // console.log(imageType)
}

(() => {

  const options = commandLineArgs([
    {
      name: 'env',
      alias: 'e',
      defaultValue: 'development',
      type: String,
    }
  ])

  const envConfig = dotenv.config({
    path: path.join(__dirname, `../../envConfig/service-config/${options.env}.env`),
  })

  initStaticDir(process.env.STATIC_PATH)

  if (envConfig.error) {
    throw envConfig.error;
  }
})();


declare global {
  interface String {
    format (args: any[]): string
  }
}

if (!String.prototype.format) {
  String.prototype.format = function () {
    var args = arguments[0];
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}
