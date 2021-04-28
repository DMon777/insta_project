const puppeteer = require('puppeteer');

async function test() {
    const login = 'kevinduglas83@yandex.ru';
    const password = '12345xyz';
    const url = "https://instagram.com";
    //const url = "https://wantpickup.ru";
    const browser = await puppeteer.launch({headless:true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage(); // создаем новую вклаюку
    page.setDefaultNavigationTimeout(0);
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36');
    await page.goto(url);
    await page.waitForTimeout(3000);
    await page.screenshot({path:'pickup.png'})


    await page.waitForSelector('div[role=dialog] button').catch(e => {
        console.log(e.message);
    })

    const button = await page.$('div[role=dialog] button').catch( e => {console.log(e.message)})
    try{
        button.click();
    } catch (e) {
        console.log(e.message);
    }

    await page.waitForSelector('input').catch( e => {
        console.log( e.message );
    });
    const inputs = await page.$$('input'); // получаем все теги input у формы
    await inputs[0].type(login);
    await inputs[1].type(password);
    await page.screenshot({path : 'afterTyping.png'})
    const logInButton = (await page.$$('button').catch( e => {
        console.log(e.message);
    }))[1];






    await browser.close();
}


test();