const DB = require('../DB');
const {randomInteger} = require('./helpers');
//const sendMailToApi = require('../mailapi');
const sendMail = require('../sendMail');
const Logger  =  require('../logger');

async function subscribe( browser, actionsCount ) {
    const db_instance = new DB();
    const sql = `SELECT * FROM subscribers WHERE is_friend=0 AND was_deleted=0 LIMIT ${actionsCount}`;
    const links = await db_instance.query( sql );

    if(links.length > 0){

        const now = new Date().getTime();
        const oneDay  = 2 * 24 * 3600 * 1000;
        const expireDate = now + oneDay;

        for (let obj of links){
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(0);
            await page.goto(obj.url);

            await page.waitForSelector('button').catch( e => {
                console.log(e.message);
            });

            /* придумал вот хороший метод для получения кнопки, я думаю так можно много чего выхватывать будет.
             * фишка тут как ты понял в том что мы находим именно ту кнопку на которой написано подписаться */
            const buttons = await page.$$('button');
            if(!buttons) {
                await page.close();
                continue;
            }

            let subscribeButton  =  null;
            for( let button of buttons ){

                let textContent = await button.evaluate( elem => {
                    return  elem.textContent;
                });
                if(textContent === "Follow"){
                    subscribeButton = button;
                    break;
                }
            }

            if(!subscribeButton){
                await page.close();
                /* если кнопки нет то это не существующий акаунт,так как похуй закрыты он
                 или открытый, кнопка по любому быть должна. Нужно ему поставить
                * was_deleted  = 1 чтобы больше не возвращатся к нему.  */
                await db_instance.updateData('subscribers',{was_deleted:1},` WHERE id=${obj.id}`);
                const logger = new Logger();
                logger.add('акаунта не существует!!!')
                logger.add(`адрес пользователя - ${obj.url}`);
                logger.writeToFile
                continue;
            }

            try {
                await subscribeButton.click();
                await db_instance.updateData('subscribers',{is_friend:1,expire_date:expireDate},` WHERE id=${obj.id}`);
                let randomIntTimeout = await randomInteger(60000, 70000);
                await page.waitForTimeout( randomIntTimeout );

                actionsCount--;
            } catch (e) {
                const logger = new Logger();
                logger.add(e.stack)
                logger.add(`аккаунт пользователя  - ${obj.url}`);
                logger.writeToFile();
            }

            await page.close();
        }

    }else{
        // подписчики законились нужно новых парсить.
       // sendMailToApi('больше не на кого подписываться, нужно новых импортировать!!!');
       //  sendMail('больше не на кого подписываться, нужно новых импортировать!!!').catch( e => {
       //      const logger = new Logger();
       //      logger.add(e.stack);
       //      logger.writeToFile();
       //  });
        const logger = new Logger();
        logger.add('больше не на кого подписываться, нужно новых импортировать!!!');
        logger.writeToFile();

    }
    return actionsCount;
}


module.exports = subscribe;
