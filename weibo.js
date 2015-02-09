var casper = require("casper").create({
  waitTimeout: 20000
});

// iPhone 5 user agent
var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53";
casper.userAgent(ua);

var weibo = casper.cli.options.weibo;
var username = casper.cli.options.username;
var password = casper.cli.options.password;
var image = casper.cli.options.image;

casper.start("http://t.cn");

casper.thenClick("div.action a:nth-child(2)", function () {
  this.waitUntilVisible("#loginAction");

  this.fillSelectors("form", {
    "#loginName": username,
    "#loginPassword": password
  }, false);
  this.click("#loginAction");
  this.waitUntilVisible("#box.container");
});

casper.thenClick("div a[data-node='compose']", function () {
  this.waitUntilVisible('header a[data-node="send"]');
  this.waitUntilVisible("textarea#txt-publisher");
});

casper.thenEvaluate(function (msg) {
  document.querySelector("textarea#txt-publisher").value = msg;

  var btnSend = document.querySelector('header a[data-node="send"]');
  $(btnSend).removeClass("disable");
}, weibo);

if (image) {
  casper.then(function () {
    this.page.uploadFile("input[type=file].picupload", image);
    this.waitFor(function () {
      var dom_ready = false;
      this.waitForSelector(".uploadList img", function(){
        dom_ready = true;
      });
      this.echo("dom_ready : " + dom_ready);
      return dom_ready;
    }, null, function timeout(){
      this.capture("timeout.png");
    }, 30000);
  });
}

casper.then(function () {
  this.waitUntilVisible('header a[data-node="send"]');
  this.click('header a[data-node="send"]');
  this.waitWhileVisible('header a[data-node="send"]', null, null, 120000);
});

casper.run();
