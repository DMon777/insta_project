const puppeteer = require('puppeteer');
const minimist = require('minimist');
const getUserSubscribers = require('./insta_modules/getUserSubscribers');
const cookieLoginInstagram = require('./insta_modules/cookieLoginInstagram');
const DB = require('./DB');
const sendMail = require('./sendMail');
//node getSubscribers.js --user=https://www.instagram.com/laurenlovinyou17/
//node getSubscribers.js --user=https://www.instagram.com/call_me_julia.tica/

/* main function  */
(async  function () {
    const login = 'kevinduglas83@yandex.ru';
    const password = '12345xyz';
    const url = await minimist((process.argv.slice(2))).user;
    const dbInstance = new DB();
    const browser = await puppeteer.launch({headless:true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const start= new Date().getTime();

    await cookieLoginInstagram(browser);
    const userSubscribers =  await getUserSubscribers(browser, url).catch(e => {
        console.log(e.message);
    });

    if(userSubscribers){
        dbInstance.insertData(userSubscribers);
        console.log("подписчики в количестве - "+userSubscribers.length+"были импортированы в базу данных");
    }

    const end = new Date().getTime();
    const mail_message = `подписчики в количестве - ${userSubscribers.length} были импортированы в базу данных.
                       Время выполнения скрипта: ${((end - start) / 1000) } sec `;
    sendMail(mail_message);
    console.log(`Время выполнения скрипта: ${((end - start) / 1000) } sec`);
    await browser.close();
})();
