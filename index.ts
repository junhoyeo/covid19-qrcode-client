import puppeteer, { LaunchOptions } from 'puppeteer';
import axios from 'axios';
import { parse } from 'node-html-parser';

export interface ICredentials {
  email: string;
  password: string;
}

export const loginWithNaver = async (
  credentials: ICredentials,
  puppeteerLaunchOptions: LaunchOptions = { dumpio: true },
) => {
  const browser = await puppeteer.launch(puppeteerLaunchOptions);

  const page = await browser.newPage();
  await page.goto('https://nid.naver.com/nidlogin.login');

  const { email, password } = credentials;
  await page.evaluate(
    (email: string, password: string) => {
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
    },
    email,
    password,
  );

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
