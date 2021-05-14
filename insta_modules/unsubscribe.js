const DB = require('../DB');
const {randomInteger} = require('./helpers');
const Loger = require('../logger');

async function unsubscribe( browser, actionsCount ) {

    const db_instance = new DB();
    const today = new Date().getTime();// потом заменить на new Date().getTime()
    const sql = `SELECT * FROM subscribers WHERE is_friend=1 AND expire_date<${today} LIMIT ${actionsCount}`;
    const links = await db_instance.query( sql );

    if(links.length > 0){

        for (let obj of links ){
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(0);
            await page.goto(obj.url);

            const unsubscribeButton = await getUnsubscribeButton( page , obj.url );

            if( !unsubscribeButton ) {
                const logger = new Loger();
                logger.add('нет кнопки для отписки, наверное аккаунта не существует, но такого быть не должно!')
                logger.add(`аккаунт пользователя  - ${obj.url}`);
                logger.writeToFile();
                await page.close();
                continue;
            }
            await unsubscribeButton.evaluate( button => button.click() ).catch( err => { console.log('button not fined!')})

            await page.waitForSelector("div[role=dialog] button").catch(e => {
                const logger = new Loger();
                logger.add(e.stack)
                logger.add(`аккаунт пользователя  - ${obj.url}`);
                logger.writeToFile();
            });
            const cancelSubscribeButton = await page.$("div[role=dialog] button");
            if(cancelSubscribeButton){
                await cancelSubscribeButton.click();
                await db_instance.updateData('subscribers',{is_friend:0,was_deleted:1},` WHERE id=${obj.id}`);

                let randomIntTimeout = await randomInteger(60000, 70000);
                await page.waitForTimeout( randomIntTimeout );

                await page.close();
                actionsCount--;
            }

        }

    }
    return actionsCount;
}

async function getUnsubscribeButton( page, url ) {
    let unsubscribeButton = null;
    await page.goto(url);
    let unsubscribeButtonSelector = '/html/body/div[1]/section/main/div/header/section/div[1]/div[1]/div/div[2]/div/span/span[1]/button';
    await page.waitForXPath( unsubscribeButtonSelector ).catch( err => {
        console.log(err.message);
    });
    unsubscribeButton = (await page.$x( unsubscribeButtonSelector ).catch( err => {
        console.log(err.message);
    }))[0];
    if(!unsubscribeButton){
        let unsubscribeButtonSelector = "/html/body/div[1]/section/main/div/header/section/div[1]/div[1]/div/div/button";
        await page.waitForXPath( unsubscribeButtonSelector ).catch( err => {
            console.log(err.message);
        });
        unsubscribeButton = (await page.$x( unsubscribeButtonSelector ).catch( err => {
            console.log(err.message);
        }))[0];
    }

    return unsubscribeButton;
}

module.exports = unsubscribe;