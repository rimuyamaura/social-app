import cron from 'cron';
import https from 'https';

const URL = 'https://social-app-b8kg.onrender.com';

const job = new cron.CronJob('*/14 * * * *', function () {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log('Successfully pinged the server');
      } else {
        console.log('Failed to ping the server');
      }
    })
    .on('error', (e) => {
      console.error('Error while sending request', e);
    });
});

export default job;
