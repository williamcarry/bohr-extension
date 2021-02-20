#  BoHrWeb Extension

BoHrWeb is an extension that allows users to securely interact with bohr-enabled web services and dApps from the browser.

Private keys are encrypted and stored within the extension and cannot be accessed by online dApps and services, making sure that users' funds are protected from malicious websites.

## Build and Run
1) Install dependencies via npm and bundle them with browserify
```
cd bohr-extension
npm install
./node_modules/.bin/browserify js/bohrCalls.js -o js/bundle.js
```
2) In Chrome go to Settings -> Extensions (chrome://extensions/)
3) Enable Developer mode
4) Click "Load unpacked" and select project folder
