// @ts-nocheck
const puppeteer = require('puppeteer');
const userFactory = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }
  constructor(_page) {
    this.page = _page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({
      name: 'session',
      value: session
    });
    await this.page.setCookie({
      name: 'session.sig',
      value: sig
    });
    await this.page.goto('http://localhost:3000/blogs');

    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(element) {
    return this.page.$eval(element, (el) => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate((_path) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', _path);

        xhr.responseType = 'json';

        xhr.setRequestHeader('credentials', 'same-site');

        // xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.addEventListener('error', (err) => {
          console.log(err);
        });
        xhr.addEventListener('load', () => {
          resolve(xhr.response);
        });

        xhr.send();
      });
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest();
          xhr.open('POST', _path);

          // prepare form data

          // set headers
          xhr.setRequestHeader('Content-Type', 'application/json');
          // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.setRequestHeader('credentials', 'same-site');

          // xhr.withCredentials = true;
          xhr.responseType = 'json';

          xhr.addEventListener('error', (err) => {
            console.error(err);
          });

          // listen for `load` event
          xhr.addEventListener('load', () => {
            resolve(xhr.response);
          });

          // send request
          xhr.send(JSON.stringify(_data));
        });
      },
      path,
      data
    );
  }
  execActions(actions) {
    return Promise.all(
      actions.map(({ path, method, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
