// @ts-nocheck
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
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
  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C'
      }
    },
    {
      method: 'post',
      path: '/api/blogs'
    }
  ];
  test('User cannot create blog post', async () => {
    const results = await page.execActions(actions);
    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });

  test('User cannot get a list of all posts', async () => {
    const results = await page.execActions(actions);
    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});
