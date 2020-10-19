# COVID19 QRcode Client

> 대한민국 전자출입명부(QR 체크인)에 사용되는 **QR 코드** 이미지를 가져오는 모듈<br />
> Programmatically generate **QR code image** used in South Korea's COVID-19 pathway check-in

- This project uses `puppeteer` for NAVER login.
- I however has **no idea** where to use this.
  - Was thinking to make a service on Apple Watch or iPhone, but Shortcuts [did it all](https://github.com/jeyraof/covid-19-qr-ios14-back-tap) 👍
- Maybe you can put this into your intranet backend and use it to your app. But I don't think it's that helpful, through.

```ts
import { loginWithNaver, getQR } from 'covid19-qrcode-client';

const cookies = loginWithNaver({
  email: 'your-email@naver.com',
  password: 'your-password',
});

getQR(cookies).then(console.log);
// 👀 data:image/jpeg;base64, iVBORw0KGgoAAAANS...
// ⏳ Active for 15 seconds
```
