import * as cheerio from 'cheerio';
import scrapingBee from '../scrapingBeeClient';

// const query = 'optisigns';

const collectG2Reviews = async () => {
  console.log('getter called');
  const res = await scrapingBee.get({
    url: 'https://www.g2.com/products/optisigns/reviews',
    params: {
      block_ads: true,
      premium_proxy: true,
      stealth_proxy: true,
    },
  }).catch((err) => {
    console.log('error', err.message);
  });

  const decoder = new TextDecoder();
  const text = res ? decoder.decode(res.data) : null;
  if (text) {
    const $ = cheerio.load(text);
    const reviews = $('[itemprop="reviewBody"]');
    console.log(reviews.contents().length);
  }
};

export default collectG2Reviews;
