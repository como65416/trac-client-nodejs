
var request_promise = require('request-promise');

class TracClientNodejs {

  constructor(api_url, username, password) {
    this.api_url = api_url;
    this.username = username;
    this.password = password;
  }

  getUserTicketIds(username, statuses, limit)
  {
    let query_params = [];
    query_params.push("owner=" + username);
    query_params.push("max=" + limit);
    for (let status of statuses) {
      query_params.push("status=" + status);
    }

    return this._callApi("ticket.query", [
      query_params.join('&')
    ]);
  }

  getTicketInfo(ticket_id) {
    return this._callApi('ticket.get', [
      ticket_id
    ]).then((response) => {
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
      return ticket_info;
    });
  }

  _callApi(method_name, params) {
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

    return request_promise(options).then ((response) => {
        if (typeof response.error !== 'undefined' && response.error !== null) {
            throw response.error.message;
        };
        return response.result;
    }).catch((err) => {
        if (typeof err.statusCode !== 'undefined' && err.statusCode == 401) {
            throw 'username or password not valid';
        } else if (typeof err.statusCode !== 'undefined') {
            throw 'call rpc api fail (status code : ' + err.statusCode + ')';
        }
        throw err;
    });
  }
}

module.exports = TracClientNodejs;
