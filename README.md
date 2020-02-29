# ✆ Click-to-Call WebComponent

<p>
    <img src="https://user-images.githubusercontent.com/29258951/73121083-687dff00-3f76-11ea-8d89-cf8b53863c54.jpg">
</p>

[**DEMO EXAMPLE**](https://cubase.github.io/c2c-example/)

[![Strict TypeScript Checked](https://badgen.net/badge/TS/Strict 'Strict TypeScript Checked')](https://www.typescriptlang.org)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/cubase/call-to-webrtc.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cubase/call-to-webrtc/context:javascript)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat)](https://github.com/cubase/call-to-webrtc/blob/master/LICENSE.md)

## What is Click-to-Call?

The definition of click-to-call (which is sometimes called click-to-talk, or click-to-text) refers to a type of digital communication in which a person clicks a button or text in order to be connected with another individual in real-time. These connections can occur via phone call, SMS or Voice-over-Internet-Protocol (VoIP). These click-to-call links are commonly found as buttons on websites. But often, click-to-call can be initiated by hyperlinks over emails and videos.

[**More informations**](https://www.ringdna.com/inside-sales-glossary/what-is-click-to-call)

## List of used technologies

- [Preact](https://github.com/preactjs/preact)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [JsSIP](https://github.com/versatica/JsSIP)
- [Rollup](https://github.com/rollup/rollup)

## Getting started

After `npm install` run:

```
npm run dev
```

Development server serves `index.html` file in root direactory

> Note: Rollup automatically takes care about
> hot reloading after source files change.

## Production build

Production build is generated using:

```
npm run build
```

into `dist/c2c.min.js`.

## Using on webpage

After project is built paste this code snippet into website `<head />` tag:

```
<script src="dist/c2c.min.js"></script>
```

> **Do not forget**: Update `src` path if you will be using different folder structure!

#### `c2c` API

##### c2c.init([config])
To render click-to-call button, call `init` function in your JavaScript code.
```
c2c.init({
    uri: 'sip:myusername@<pbx.hostname.com>',
    user: 'myusername',
    password: 'mypassword',
    socket: 'wss://pbx.websockethostname.com',
    callto: 'sip:callto@<pbx.hostname.com>',
    color?: 'green',
    position?: 'left',
    text?: 'Call us!'
})
```

## Compatibility
Click-to-call widget is rendered only in WebRTC compatible browsers. Current version does not support mobile browsers.

## License
[MIT](https://github.com/cubase/call-to-webrtc/blob/master/LICENSE.md)
