import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
const user = process.env.MAIL_USER || '957196958@qq.com';
const pass = process.env.MAIL_PASS || 'plndruqdsrutbcji';
console.log({
  user,
  pass,
});
console.log('path' + join(__dirname, '../', './templates/email'));
export default {
  transport: {
    service: 'qq',
    // host: 'smtp.swireproperties.com',
    port: 25,
    secure: true, //安全方式发送,建议都加上
    auth: {
      user,
      pass,
    },
  },
  defaults: {
    from: `nest-modules <asdasda>`, // outgoing email ID
  },
  template: {
    dir: join(__dirname, '../', './templates/email'),
    adapter: new EjsAdapter(),
    options: {
      //form: https://stackoverflow.com/questions/62217160/nestjs-email-failed-to-send-with-ejs-template-dynamic-data
      //此处strict若为true ejs 模板中的变量需从locals对象中获取   or Disable strict mode
      // Context properties are passed to your compiled EJS templates in an object called locals.
      // If you update your template variables to use the locals prefix, those values can be resolved and substituted:
      // There are two approaches to solving this problem:
      strict: false,
    },
  },
};
