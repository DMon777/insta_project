const puppeteer = require('puppeteer');
 const loginInstagram = require('./insta_modules/loginInstagram');
const cookieLogin = require('./insta_modules/cookieLoginInstagram');
const sendMailToApi = require('./mailapi');
const DB = require('./DB');
const subscribe = require('./insta_modules/subscribe');
const unsubscribe = require('./insta_modules/unsubscribe');
const {randomInteger} = require('./insta_modules/helpers');




/* main function  */
(async  function () {
    const login = 'kevinduglas83@yandex.ru';
    const password = '12345xyz';

    const start= new Date().getTime();
    const browser = await puppeteer.launch({headless:true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    await cookieLogin(browser);

    await action(browser);
    const end = new Date().getTime();
    console.log(`Время выполнения скрипта: ${((end - start) / 1000) } sec`);
    await browser.close();

})();

async function action( browser ) {
   // const randomActionsCount = randomInteger(23,29);
    //let actionsCount = randomActionsCount;
    let actionsCount = 3;
    actionsCount = await unsubscribe(browser,actionsCount);
    if(actionsCount > 0){
        await subscribe(browser,actionsCount);
    }
}