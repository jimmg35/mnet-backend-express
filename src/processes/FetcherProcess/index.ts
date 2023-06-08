import { IProcess } from '../BaseProcess'
import { autoInjectable, inject } from "tsyringe"
import { PostgreSQLContext } from "../../lib/dbcontext"
import { CronJob, CronCommand } from 'cron'

@autoInjectable()
export default class FetcherProcess implements IProcess {
  public dbcontext: PostgreSQLContext
  // public geoJsonFetcher: GeoJsonFetcher
  public cron: string
  public job: CronJob | undefined

  constructor(
    @inject('dbcontext') dbcontext: PostgreSQLContext,
    // @inject('geoJsonFetcher') geoJsonFetcher: GeoJsonFetcher
  ) {
    this.dbcontext = dbcontext
    // this.geoJsonFetcher = geoJsonFetcher
    this.cron = '0 8 * * 1'
    // */5 * * * * *
    // 0 0 * * * */1
  }

  public connectDB = async () => {
    await this.dbcontext.connect()
  }

  public start = async () => {
    if (!this.dbcontext.connection) await this.connectDB()
    if (!this.job) {
      const fetchJob: CronCommand = () => {
        // this.geoJsonFetcher.job(this.dbcontext, 'system')
      }
      this.job = new CronJob(
        this.cron, fetchJob, null, true, 'Asia/Taipei'
      )
      return
    }
    this.job.start()
    console.log(this.job.running)
  }

  public stop = async () => {
    if (this.job) {
      this.job.stop()
      console.log(this.job.running)
    }
  }
}
