# trac-client-nodejs (Not Finish)
a library used for control The Trac Project ticket (nodejs)

### Example Code :

```js
var TracClientNodejs = require('trac-client-nodejs');

$api_url = "http://trac.local/login/jsonrpc";
$username = "your_username";
$password = "your_password";
$client = new TracClientNodejs($api_url, $username, $password);

$client.getTicketInfo(1).then((ticket_info) => {
    console.log(ticket_info);
}).catch ((error) => {
    console.log("Error:", error);
});
```