const fs = require('fs');

async function loginInstagram( browser, login, password ) {

    const url = "https://instagram.com";

    const page = await browser.newPage(); // создаем новую вклаюку
    await page.setDefaultNavigationTimeout( 0 );
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36');
    //await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36');
    await page.goto(url);
    await page.waitForTimeout(4000);
    await page.screenshot({ fullPage: true, path: 'goTopage.png' });
    //получил код страницы когда находился в режиме headless
    //await page.waitForTimeout(1000);

     /* IF ( HEADLESS MODE  == TRUE )  */
    // await page.waitForSelector('#link_profile').catch( e => {
    //     console.log( e.message );
    // });
    // const loginLink = await page.$('#link_profile');
    // await loginLink.click();
    // await page.waitForNavigation({waitUntil: 'load'});
    // await page.screenshot({ fullPage: true, path: 'screenshot.png' });
    //  await page.waitForNavigation({waitUntil: 'load'});
    //  await page.screenshot({ fullPage: true, path: 'screenshot.png' });
    const html = await page.content(); // получаем код страницы
    fs.writeFile('page.html', html, () => console.log('HTML saved'));
    await page.waitForSelector('div[role=dialog] button').catch(e => {
        console.log(e.message);
    })
    //
    // const button  =  await page.$eval('div[role=dialog] button', elem => {
    //     return elem.textContent;
    // }).catch(e => {console.log( e.message )});
    // console.log(button);
    const button = await page.$('div[role=dialog] button').catch( e => {console.log(e.message)})
    try{
        button.click();
    } catch (e) {
        console.log(e.message);
    }
    await page.waitForTimeout(5000);
    await page.screenshot({path : 'afterAcceptCookieButtonClicking.png'});
    console.log('сделал скрин после нажатия на кнопку!')
    /* ENDIF */

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


    await logInButton.click(); // авторизируемся в instagramm
    await page.waitForTimeout(5000);
    await page.screenshot({path: 'afterloginbuttonClick.png'});

    //await page.waitForNavigation({waitUntil: 'load'}); // дожидаемся перехода на новый url

    await page.screenshot({path : 'newPageAfterLoginButtonClick.png'});
    console.log('перешел на страницу после нажатия на login')


    const notNowButtonSelectorXpath = '/html/body/div[1]/section/main/div/div/div/div/button';

    await page.waitForXPath(notNowButtonSelectorXpath).catch( e => {
        console.log(e.message);
    });

    const notNowButton = (await page.$x(notNowButtonSelectorXpath))[0];

    await notNowButton.click();

    const cookies = await page.cookies();
    const cookieJson = JSON.stringify(cookies);

    fs.writeFileSync('cookiesLogin.json', cookieJson);
    // await page.waitForTimeout(5000);
     await page.screenshot({ fullPage: true, path: 'result.png' })
}

module.exports = loginInstagram;