# BrowserUrlLengthChecker

Check the Url length on BrowserAddressBar by js

## Proporsal

To grasp the browsers limit of url length and bookmarkable length.
It's need for maiking new usefull bookmarklets.

### TEST page

https://ryunosinfx.github.io/BrowserUrlLengthChecker/

### how work
#### at open
hashcode:SHA256 is calced form the url strings made for test.
the url is made by attating random longlong BASE64 querystring.
when open the url,this page calc hash code current url and show in the page.
#### push start button
you can test how long url is openable on this browser by pushing "START" button.
Page start test by make url and open the url,and when opened by js,opened page send culeced hash of opend page's url and close itself.
The test length of url is starting "URL length" form inputed value.
Its is increase 120% of diff whitch is starting 1 until it show not openable error.
when the url length is not openable ,It is decrease harf of diff with last length openable url.
The  process is doing until the diff of last length openable url and un openable url is under 10 chars.
When end of the test,page show "-complete-" and the openable length url set to bookmake chareng page link.

#### push make link button
when pushing make link button ,the page make url and set link to "Link for Bookmark Making Challenge!"str.
The url length is  from "URL length" input value.
The pushed reaction is that "status" show "LINK MAKED! CURRENT url hash:**hash sha-256 value** / size:**inputed url length**".
Then  you can bookmark the url  made as target length.


