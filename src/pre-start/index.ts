import "reflect-metadata"
import path from 'path'
import dotenv from 'dotenv'
import commandLineArgs from 'command-line-args'
import fs from 'fs'

const initStaticDir = (staticPath: string | undefined) => {
  if (!staticPath) return
  const staticFilePath = path.join(__dirname, `..${staticPath}`)
  if (!fs.existsSync(staticFilePath)) {
    fs.mkdirSync(staticFilePath)
  }
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
