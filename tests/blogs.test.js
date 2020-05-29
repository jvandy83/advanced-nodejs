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
  describe('When logged in and using invalid inputs', async () => {
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
