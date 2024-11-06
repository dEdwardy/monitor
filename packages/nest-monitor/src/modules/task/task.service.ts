import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly emailService: EmailService,
    private readonly httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  private readonly logger = new Logger(TaskService.name);

  // every 1 min check one time
  @Cron('0 */1 * * * *', {
    name: 'up-reminder',
  })
  async getInfoFromBLBL() {
    // this.emailService.sendToMe();
    await this.getDynamic();
  }

  // @Cron('0 */1 9-21 * * *', {
  //   name: 'test-reminder',
  // })
  cronTest() {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  }
  // 获取动态
  async getDynamic() {
    const uid = '42163853';
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${uid}&page_size=1`;
    const { data } = await this.httpService.get(url).toPromise();
    const rencentTimestamp = data?.data?.cards?.[0]?.desc?.timestamp;
    let oldTimestamps: any = await this.client.get('dpp_dynamic_timestamp');
    oldTimestamps = Number(oldTimestamps);
    if (oldTimestamps === 0) {
      await this.client.set('dpp_dynamic_timestamp', rencentTimestamp);
    }
    const type = data?.data?.cards?.[0]?.desc?.type; // 2动态 8 视频
    // 动态Id       desc   bvid title
    // 前2 属于 type===2 的动态  后面属于视频属性
    let dynamic_id, desc, bvid, title, img;
    if (rencentTimestamp - oldTimestamps > 0) {
      if (type === 2) {
        // 动态Id
        dynamic_id = data?.data?.cards?.[0]?.desc?.dynamic_id;
        desc = JSON.parse(data?.data?.cards?.[0]?.card)?.item?.description;
        img = JSON.parse(data?.data?.cards?.[0]?.card)?.item?.pictures?.[0]
          ?.img_src;
      } else if (type === 8) {
        bvid = data?.data?.cards?.[0]?.desc?.bvid;
        title = JSON.parse(data?.data?.cards?.[0]?.card)?.title;
        img = JSON.parse(data?.data?.cards?.[0]?.card)?.first_frame;
      }
      this.logger.debug(`类型:${type} `, dynamic_id, desc, bvid, title);
      await this.emailService.sendToMe({
        title: type === 2 ? desc : title,
        img,
        url:
          type === 2
            ? // ? `https://m.bilibili.com/dynamic/${dynamic_id}`
              `https://space.bilibili.com/42163853`
            : `https://www.bilibili.com/video/${bvid}`,
      });
      console.log({
        title: type === 2 ? desc : title,
        img,
        url:
          type === 2
            ? // ? `https://t.bilibili.com/${dynamic_id}`
              `https://space.bilibili.com/42163853`
            : `https://www.bilibili.com/video/${bvid}`,
      });
      await this.client.set('dpp_dynamic_timestamp', rencentTimestamp);
    }
  }

  async test() {
    const uid = '42163853';
    const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${uid}&page_size=1`;
    const { data } = await this.httpService.get(url).toPromise();
    const bvid = data?.data?.cards?.[0]?.desc?.bvid;
    const title = JSON.parse(data?.data?.cards?.[0]?.card)?.title;
    return { title, url: `https://www.bilibili.com/video/${bvid}` };
    // const rencentTimestamp = data?.data?.cards?.[0]?.desc?.timestamp;
    // let oldTimestamps: any = await this.client.get('dpp_dynamic_timestamp');
    // oldTimestamps = Number(oldTimestamps);
    // console.log(oldTimestamps);
    // if (oldTimestamps === 0) {
    //   await this.client.set('dpp_dynamic_timestamp', rencentTimestamp);
    // }
    // if (rencentTimestamp - oldTimestamps > 0) {
    //   this.logger.debug('Up更新了哟~');
    //   await this.emailService.sendToMe();
    // } else {
    //   this.logger.debug('Up暂未更新哟');
    // }
  }

  addCronJob(name: string, seconds: number) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.debug(`${seconds} for job ${name} to run !`);
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.warn(
      `job ${name} added for each minute at ${seconds} seconds !`,
    );
  }

  getCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
    return 'ok';
  }
}
