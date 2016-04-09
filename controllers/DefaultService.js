'use strict';

exports.message = function(args, res, next) {
  /**
   * parameters expected in the args:
   * workspaceId (String)
   * input (MessageRequest)
   **/

var examples = {};
  
  examples['application/json'] = "{\n  \"intents\": [\n    {\n      \"intent_id\": \"pizza\",\n      \"confidence\": 0.94302\n    }\n  ],\n  \"entities\": [\n    {\n      \"entity_id\": \"toppings\",\n      \"value\": \"pepperoni\",\n      \"location\": [\n        21,\n        30\n      ]\n    }\n  ],\n  \"output\": {\n    \"text\": [\"Great\",\" would you like anything else on your pizza?\"]\n  },\n  \"state\": {\n    \"dialog_node_id\": \"pizza_order\",\n    \"conversation_id\": \"2a47d342\",\n    \"toppings\": [\n      \"pepperoni\"\n    ]\n  }\n}";
  

  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}
