const {randomInteger} = require('./helpers');
//нужно както передать эту функцию может require внутрь засунуть
async function getSubscribersScroll( browser,url ){

    const page = await browser.newPage(); // создаем новую вклаюку
    await page.goto(url);

    const subsButtonSelector = '/html/body/div[1]/section/main/div/header/section/ul/li[2]/a';
    await page.waitForXPath(subsButtonSelector).catch(e => {
        // почему-то в это исключение мы не попадаем
        console.log(e.message);
    })
    const subsButton = (await page.$x(subsButtonSelector))[0];
    await subsButton.click();

    //const subsBoxSelector = '/html/body/div[4]/div/div/div[2]';// div.isgrP
    const subsBoxSelector = '/html/body/div[5]/div/div/div[2]';// div.isgrP
    await page.waitForXPath( subsBoxSelector ).catch(e => {
        console.log(e.message);
        throw new Error('cookies failed!');
    });
    const subscribersBox = (await page.$x( subsBoxSelector ))[0];
    const boundingBox = await subscribersBox.boundingBox();
    await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
    );

    const userLinks =  await getAllLinks( page ).catch( err => {
        console.log(err.message);
    });

    return userLinks;

}

async function getAllLinks( page ){
    return new Promise( async resolve => {

        let interval = setInterval( async () => {

            const countSubscribersSelector = '/html/body/div[1]/section/main/div/header/section/ul/li[2]/a/span';
            await page.waitForXPath(countSubscribersSelector).catch( e => {
                console.log(e.message);
            })
            const countSubscribersHandle = (await page.$x(countSubscribersSelector).catch(e => {
                console.log(e.message);
            }))[0];
            const countSubscribers = await countSubscribersHandle
                .evaluate(elem => {
                    let textContent = elem.textContent;
                    textContent = textContent.replace(/(\s|,)/g, '');
                    return Number(textContent);
                });

            const subsBoxSelector = '/html/body/div[5]/div/div/div[2]';// div.isgrP
            const shElHandle = (await page.$x( subsBoxSelector ))[0];
            const sh = await shElHandle.evaluate( elem => elem.scrollHeight );

            const bottom = await shElHandle.evaluate( elem => {
               return elem.scrollTop + elem.clientHeight + 1
            } ).catch(e => {
                console.log(e.message);
            });
            await shElHandle.evaluate( elem => {
                return elem.scrollTop += 100;
            } );

            if( sh <= bottom ) {
                console.log('scroll to the bottom');
                const userLinksSelector = 'div.PZuss li>div>div:nth-child(1)>div:nth-child(2) a';
                await page.waitForSelector( userLinksSelector ).catch( e => {
                    console.log(e.message);
                });
                const userLinks = await page.$$eval(userLinksSelector,
                    allLinks => allLinks.map(link => {
                        return "https://instagram.com"+link.getAttribute('href')
                    }));
                console.log(`user links length - ${userLinks.length} 
                count subscribers - ${countSubscribers}`);
                if(userLinks.length + 1 < countSubscribers){
                    await shElHandle.evaluate( elem => elem.scrollTop -= 200 );
                }else{
                    clearInterval( interval );
                    resolve(userLinks)
                }
            }
        },1000);

    })
}

module.exports = getSubscribersScroll;