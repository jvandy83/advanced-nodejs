// @ts-nocheck
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });
  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('and using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('input[name="title"]', 'My Title');
      await page.type('input[name="content"]', 'My Content');
      await page.click('form button');
    });
    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toMatch('Please confirm your entries');
    });
    test('Submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');
      const cardTitle = await page.getContentsOf('.card-title');
      const cardContent = await page.getContentsOf('p');
      expect(cardTitle).toEqual('My Title');
      expect(cardContent).toEqual('My Content');
    });
  });

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button');
    });
    test('the form shows an error message', async () => {
      const title = await page.getContentsOf('.title .red-text');
      const content = await page.getContentsOf('.content .red-text');
      expect(title).toEqual('You must provide a value');
      expect(content).toEqual('You must provide a value');
    });
  });
});
describe('User is not logged in', async () => {
  test('User cannot create blog post', async () => {
    const result = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'api/blogs');

        // prepare form data
        let data = {
          title: 'My Title',
          content: 'My Content'
        };

        // set headers
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('credentials', 'same-site');

        // xhr.withCredentials = true;
        xhr.responseType = 'json';

        xhr.addEventListener('error', (err) => {
          console.error(err.message);
        });

        // listen for `load` event
        xhr.addEventListener('load', () => {
          resolve(xhr.response);
        });
        // send request
        xhr.send(JSON.stringify(data));
      }).catch((err) => console.log(err));
    });
    expect(result).toEqual({ error: 'You must log in!' });
  });
  test('User cannot get a list of all posts', async () => {
    const result = await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', 'api/blogs');

        xhr.responseType = 'json';

        xhr.setRequestHeader('credentials', 'same-site');

        xhr.addEventListener('error', (err) => {
          console.error(err.message);
        });
        xhr.addEventListener('load', () => {
          resolve(xhr.response);
        });

        xhr.send();
      });
    });
    expect(result).toEqual({ error: 'You must log in!' });
  });
});
