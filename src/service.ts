import { Server } from './server'
import { attachedControllers, attachedProcess } from './di'

(async () => {

  // 註冊控制器
  const server = new Server({
    controllers: attachedControllers,
    processes: attachedProcess
  })

  // 啟動後端伺服器
  server.start()

})()
