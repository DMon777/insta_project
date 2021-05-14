const fs = require('fs');

async function cookieLoginInstagram( browser ) {
    const url = "https://instagram.com";

    const page = await browser.newPage(); // создаем новую вклаюку
   // await page.setDefaultNavigationTimeout(0);

    const cookies = fs.readFileSync(`${__dirname}/../cookies.json`, 'utf8')
    const deserializedCookies = JSON.parse(cookies)
    await page.setCookie(...deserializedCookies)
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36');

    // await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36');
    await page.goto(url);
    await page.waitForTimeout(3000);
    await page.screenshot({path:'aftercookie.png'});
}

module.exports = cookieLoginInstagram;