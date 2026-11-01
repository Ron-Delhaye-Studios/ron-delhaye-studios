const {defineConfig} = require('@playwright/test');
module.exports = defineConfig({
  testDir:'./tests',
  use:{baseURL:'http://127.0.0.1:4173'},
  webServer:{command:'python3 -m http.server 4173 --bind 127.0.0.1',url:'http://127.0.0.1:4173',reuseExistingServer:false},
  projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}]
});
