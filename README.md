![](https://github.com/sirateek/LINEPay-API-Example/raw/master/Images/maxresdefault.jpg)
# LINEPay API Example
The example of LINEPay API project using LINE Messaging API x Firebase

## How to use?
This project was created base on Firebase Cloud Function x LINE Messaging API. It contain 2 cloud function to serve its service which is
* **webhook** - Use the endpoint url to this function to hook it with LINE Messaging API
* **confrimOrder** - This function will be called after the user take the action with the order from LINE Pay API no matter it success or not


Installation is simple, Just copy this code and deploy it to your firebase project then config the webhook url in LINE Messaging API to hook it with the `webhook` function

## Payload creator
Payload creator is a Javascript module that will return the JSON payload data when it was called (This is not a dependency. But it help to reduce the code in file `index.js`. Make it easier to read)

## Dependency usage
This project use these dependency to complete the operation
* **[lineapihelper](https://www.npmjs.com/package/lineapihelper)**
* [request](https://www.npmjs.com/package/request)
* [request-promise](https://www.npmjs.com/package/request-promise)

## Check out this tutorial on medium
* [Click here](https://sirateek.me)

### Develop with ♡ by [Siratee K](https://sirateek.me).
