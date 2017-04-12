import * as tabris from "tabris";
import {NYTResponse} from "./nyt";

async function main():Promise<void> {

    let page = new tabris.Page({
        topLevel: true,
        title: 'Home',
    });

    page.open();
    let scrollView = new tabris.ScrollView({left: 0, right: 0, top: 0, bottom: 0, direction: 'vertical'});
    scrollView.appendTo(page);
    let response = await fetch('https://api.nytimes.com/svc/topstories/v2/home.json?api-key=61f28952540e47a0bd32de8de7fd92e5');
    let nytResponse = <NYTResponse>await response.json();

    let alternate = true;
    for (let result of nytResponse.results) {
        if (result.multimedia.length === 0)continue;

        let body = new tabris.Composite({
            left: 0, right: 0, height: 100, top: 'prev()',
            background: alternate ? '#EEEEEE' : '#DDDDDD',
            highlightOnTouch: true
        }).on('tap', () => {
            let otherPage = new tabris.Page({topLevel: false, title: 'Article'});
            otherPage.append(new tabris.ImageView({left: 0, right: 0, top: 0, height: 200, scaleMode: 'fill', image: result.multimedia.filter(a => a.format == 'superJumbo')[0].url}));

            let contentScrollView = new tabris.ScrollView({left: 0, right: 0, top: 'prev()', bottom: 0})
            otherPage.append(contentScrollView);
            contentScrollView.append(new tabris.TextView({left: 10, right: 10, top: 0, text: result.abstract.repeat(80)}))
            otherPage.open();
        });

        alternate = !alternate;

        let image: tabris.ImageView;
        body.append(image = new tabris.ImageView({
            left: 0,
            width: 100,
            top: 0,
            bottom: 0,
            image: result.multimedia.filter(a => a.format == 'Normal')[0].url
        }));
        body.append(new tabris.TextView({
            left: [image, 5],
            right: 0,
            top: 0,
            bottom: 0,
            markupEnabled: true,
            text: result.title,
            font: '18px bold'
        }));


        body.append(new tabris.TextView({
            left: [image, 5],
            right: 0,
            top: 'prev()',
            bottom: 0,
            markupEnabled: true,
            text: result.abstract,
            maxLines: 1,
            font: '14px'
        }));

        body.appendTo(scrollView);
    }

}


main().catch(ex => console.error(ex));