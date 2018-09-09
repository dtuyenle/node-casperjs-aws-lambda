try {
  
    phantom.addCookie({ ttScan: 'v1.5' });
    
    var casper = require("casper").create({
      ignoreSslErrors: true,
      exitOnError: false,
      sslProtocol: 'any',
      verbose: false,
      logLevel: 'debug',
      pageSettings: {
        javascriptEnabled: true,
        logLevel: 'debug',
        loadPlugins: true,
        webSecurityEnabled: true,
        loadImages: true,
        XSSAuditingEnabled: false,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11'
      },
      options: { waitTimeout: 25000 }
    });
  
    var url = 'https://m.bestbuy.ca/en-CA';
  
    casper.start(url).zoom(1).viewport(1600,1000);
  
    casper.on('page.initialized', function() {
      this.evaluate(function() {
        window.taglogs = [];
        window._satellite = window._satellite || {};
        window._satellite._monitors = window._satellite._monitors || [];
        window._satellite._monitors.push({
          ruleTriggered: function (event) {
            console.log(
              'rule triggered', 
              event.rule
            );
            taglogs.push({
              name: 'rule triggered',
              rule: event.rule
            });
          },
          ruleCompleted: function (event) {
            console.log(
              'rule completed', 
              event.rule
            );
            taglogs.push({
              name: 'rule completed',
              rule: event.rule
            });
          },
          ruleConditionFailed: function (event) {
            console.log(
              'rule condition failed', 
              event.rule, 
              event.condition
            );
            taglogs.push({
              name: 'rule failed',
              rule: event.rule
            });
          }
        });
      });
    });
  
    // casper.on("resource.error", function(resourceError){
    //   console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
    //   console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
    // });
    
    casper.then(function() {
      this.evaluate(function() {
        for(var i = 0, length = _satellite.rules.length; i < length; i++) {
          if(jQuery(_satellite.rules[i].selector).length > 0) {
            _satellite.rules[i].availability = true;
          } else {
            _satellite.rules[i].availability = false;
          }
        }
      })
    })
    
    casper.then(function() {  
      this.waitForText("Brands", function() {
        casper.clickLabel('Brands', 'span');
      });
    })
  
    casper.run(function() {
      var _this = this;
    
      var result = this.evaluate(function() {
        return taglogs;
      });
      _this.debugPage();
      _this.echo('+++++++++++++++++++++++++++');

      _this.echo(JSON.stringify(result));
      _this.page.close();
      _this.exit();
    
    });
    
    
  
  }
  catch (e) {
    console.log(e);
  }