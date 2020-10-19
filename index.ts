import puppeteer from 'puppeteer';
import axios from 'axios';
import { parse } from 'node-html-parser';

export interface ICredentials {
  email: string;
  password: string;
}

export const loginWithNaver = async (credentials: ICredentials) => {
  const browser = await puppeteer.launch({
    dumpio: true,
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto('https://nid.naver.com/nidlogin.login');

  await page.evaluate(({ email, password }) => {
    const emailInputElement = document.querySelector<HTMLInputElement>(
      'input#id',
    );
    if (emailInputElement) {
      emailInputElement.value = email;
    }
    const passwordInputElement = document.querySelector<HTMLInputElement>(
      'input#pw',
    );
    if (passwordInputElement) {
      passwordInputElement.value = password;
    }
  }, credentials);

  await page.click('input.btn_global');
  await page.waitForNavigation();

  const cookies = await page.cookies();
  console.log(cookies);

  return cookies;
};

export interface ICookie {
  name: string;
  value: string;
}

export const getQR = async (cookies: ICookie[]) => {
  const cookie = cookies.reduce(
    (accumulated, currentCookie) =>
      (accumulated += `${currentCookie.name}=${currentCookie.value}; `),
    '',
  );

  const { data: html } = await axios.get<string>(
    'https://nid.naver.com/login/privacyQR',
    {
      headers: {
        cookie,
      },
    },
  );

  const qrImage = parse(html).querySelector('#qrImage');
  if (qrImage) {
    return qrImage.getAttribute('src');
  }
  return null;
};
