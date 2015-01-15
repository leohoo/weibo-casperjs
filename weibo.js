var casper = require("casper").create({
  waitTimeout: 10000
});

var ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
casper.userAgent(ua);

var weibo = casper.cli.options.weibo;
var username = casper.cli.options.username;
var password = casper.cli.options.password;

casper.start("http://t.cn");

casper.thenClick("div.action a:nth-child(2)", function(){
    this.waitUntilVisible("#loginAction");

    this.fillSelectors("form", {"#loginName": username, "#loginPassword": password}, false);
    this.click("#loginAction");
    this.waitUntilVisible("#box.container");
  });

casper.thenClick("div a[data-node='compose']", function(){
    this.waitUntilVisible('header a[data-node="send"]');
    this.waitUntilVisible("textarea#txt-publisher");
  });

casper.thenEvaluate(function(msg) {
    document.querySelector("textarea#txt-publisher").value = msg;

    var btnSend = document.querySelector('header a[data-node="send"]');
    $(btnSend).removeClass("disable");
  }, weibo);
  
casper.then(function(){
    this.waitUntilVisible('header a[data-node="send"]');
    this.click('header a[data-node="send"]');
    this.waitWhileVisible('header a[data-node="send"]');
  });

casper.run();

