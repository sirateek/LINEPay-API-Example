# lineapihelper( Messaging API )

LINE API Helper ( Messaging API ) for LINE Developer

## Getting Started

This Helper of LINE Messaging API will help you to develop the chatbot easier. With only one dependency, You will have tools that will help you to do the command like reply, push, multicast, broadcast, etc. or do the request decode to get the userId, event type, replyToken, etc.

### Installing

LINE API Helper is an npm package. You can simply install it by using this command.

```
$ npm i lineapihelper
```

### Example Code

This is the example code using LINE API Helper hosted by Firebase Cloud Functions.

```
exports.LINEAPIHelper = functions.https.onRequest((req, res) => {
  const lah = require("lineapihelper");
  lah.setrequest(req);
  lah.cat("Your channel access token");
  var payload = [
    {
      type: "text",
      text: "Hello from lineapihelper",
    }
  ]
  return lah.reply(lah.replyToken(), payload).then((response) => {
    console.log(response)
    return res.status(200).send();
  }).catch((e) => {
    console.log(e)
    return res.status(500).send();
  })
})
```

**UPDATE:** LINE API Helper from version 0.1.1 is support Dialogflow Request Decode to help the developer using fulfillment easier!

### Example Code (Dialogflow Fulfillment)

```
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  const lah = require("lineapihelper");
  lah.setrequest(request);
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function userId(agent) {
    agent.add(lah.userId());
  }

  let intentMap = new Map();
  intentMap.set('Get userId', userId);
  agent.handleRequest(intentMap);
});

```

**For the Dialogflow user.** You can use all of the features in this dependency. By using the same commands as you use in non-dialogflow development, You can get the data from the request or send messages to the user easily.

Note: In the dialogflow-fulfillment new version, It requires you to do the reply by using `agent.add()`. If you use only `.reply()` in my dependency. It may cause you an error in cloud functions ("No responses defined for platform: 'LINE'").

### For more information, Please go to the [package reference wiki](https://github.com/sirateek/lineapihelper/wiki/Package-Reference) to see the package documentation

## Dependency Structure

LINE API Helper use these dependencies in background to handle the command.

- [request](https://www.npmjs.com/package/request)
- [request-promise](https://www.npmjs.com/package/request-promise)
- **crypto**

## LINE API Reference

- [Messaging API Reference](https://developers.line.biz/en/reference/messaging-api/)
- [LINE Developer](https://developers.line.biz)

### Develop with ♡ by Siratee K.
