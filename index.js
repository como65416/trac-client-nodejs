
var request = require('request');

class TracClientNodejs {

  constructor(api_url, username, password) {
    this.api_url = api_url;
    this.username = username;
    this.password = password;
  }

  getUserTicketIds(username, statuses, limit, callback)
  {
    let query_params = [];
    query_params.push("owner=" + username);
    query_params.push("max=" + limit);
    for (let status of statuses) {
      query_params.push("status=" + status);
    }

    this._callApi("ticket.query", [
      query_params.join('&')
    ], callback);
  }

  getTicketInfo(ticket_id, callback) {
    this._callApi('ticket.get', [
      ticket_id
    ], (response, error) => {
      if (error !== null) {
        callback(response, error);
        return;
      }

      let ticket_info = {};
      ticket_info.time_created = response[1].__jsonclass__[1]
      ticket_info.time_changed = response[2].__jsonclass__[1];
      if (typeof response[3].changetime !== 'undefined') {
        delete response[3].changetime;
      }
      if (typeof response[3].time !== 'undefined') {
        delete response[3].time;
      }
      ticket_info = {...ticket_info, ...response[3]};
      callback(ticket_info, error);
    });
  }

  _callApi(method_name, params, callback) {
    let options = {
      uri: this.api_url,
      method: "POST",
      json: true,
      body: {
        "method" : method_name,
        "params" : params
      },
      auth: {
        'user': this.username,
        'pass': this.password,
        'sendImmediately': false
      }
    }

    request(options, (error, response, body) => {
      let err = null;
      if (response.statusCode == 401) {
        err = 'username or password not valid';
      } else if (response.statusCode != 200) {
        err = 'call rpc api fail (status code : ' + response.statusCode + ')';
      } else if (typeof body.error !== 'undefined' && body.error !== null) {
        err = body.error.message;
      }

      let result = (typeof body.result !== 'undefined') ? body.result : null ;
      callback(result, err);
    });
  }

}
module.exports = TracClientNodejs;
