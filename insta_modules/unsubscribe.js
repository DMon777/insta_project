const DB = require('../DB');
const {randomInteger} = require('./helpers');

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

            const unsubscribeButtonSelector = '/html/body/div[1]/section/main/div/header/section/div[1]/div[1]/div/div[2]/div/span/span[1]/button';
            await page.waitForXPath( unsubscribeButtonSelector ).catch( err => {
                console.log(err.stack);
                console.log(`аккаунт пользователя - ${obj.url}`)
                console.log("----------------------------------------");
            });
            const unsubscribeButton = (await page.$x( unsubscribeButtonSelector ).catch( err => {
                console.log(e.message);
            }))[0];

            if( !unsubscribeButton ) {
                await page.close();
                continue;
            }
            await unsubscribeButton.evaluate( button => button.click() ).catch( err => { console.log('button not fined!')})

            await page.waitForSelector("div[role=dialog] button").catch(e => {
                console.log(e.message);
            });
            const cancelSubscribeButton = await page.$("div[role=dialog] button");
            if(cancelSubscribeButton){
                await cancelSubscribeButton.click();
            }
            await db_instance.updateData('subscribers',{is_friend:0,was_deleted:1},` WHERE id=${obj.id}`);

            let randomIntTimeout = await randomInteger(60000, 70000);
            await page.waitForTimeout( randomIntTimeout );

            await page.close();
            actionsCount--;
        }

    }
    return actionsCount;
}

module.exports = unsubscribe;