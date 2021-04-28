
async function getUserSubscribers( browser, url ) {

    const page = await browser.newPage(); // создаем новую вклаюку
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);

    const countSubscribersSelector = '/html/body/div[1]/section/main/div/header/section/ul/li[2]/a/span';

    const countSubscribersHandle = (await page.$x(countSubscribersSelector).catch(e => {
        console.log(e.message);
    }))[0];

    const countSubscribers = await countSubscribersHandle
        .evaluate(elem => Number(elem.textContent));

    const subscribesButtonSelectorXpath = '/html/body/div[1]/section/main/div/header/section/ul/li[2]/a';

    await page.waitForXPath(subscribesButtonSelectorXpath).catch(e => {
        console.log(e.message);
    });

    const subscribesButton = (await page.$x(subscribesButtonSelectorXpath))[0];

    await subscribesButton.click();

    const subsBoxSelector = '/html/body/div[5]/div/div';// div.isgrP
    await page.waitForXPath(subsBoxSelector).catch(e => {
        console.log(e.message);
    });
    const subscribersBox = (await page.$x(subsBoxSelector))[0];
    const boundingBox = await subscribersBox.boundingBox();
    await page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
    );

    await page.mouse.wheel({deltaY: 300}).catch(e => {
        console.log('колесо не крутится((');
    });
    await page.waitForTimeout( 1000 );
    let userLinks;
    let linksLength = 0;
    do{
        await page.mouse.wheel({deltaY: 50}).catch(e => {
            console.log('колесо не крутится((');
        });
        /* /html/body/div[5]/div/div/div[2]/ul/div/li/div/div[1]/div[2]/div[1]/span/a */
        const userLinksSelector = 'div.PZuss li>div>div:nth-child(1)>div:nth-child(2) a';
        await page.waitForSelector( userLinksSelector ).catch( e => {
            console.log("селектор для получения ссылок пользователей не работает!!");
            throw ('мы не смогли выбрать пользователей из-за сломанного селектора');
        });
        userLinks = await page.$$eval(userLinksSelector,
            allLinks => allLinks.map(link => {
                return "https://instagram.com" + link.getAttribute('href')
            }));
        if (userLinks) {
            linksLength = userLinks.length > linksLength ? userLinks.length : linksLength;
        }

    }
    while (linksLength < countSubscribers);
    return userLinks;
}
module.exports = getUserSubscribers;
