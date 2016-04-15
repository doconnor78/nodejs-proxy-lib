/* Copyright IBM Corp. 2016
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var util = require ( 'util' );
var watson = require ( 'watson-developer-cloud' );

module.exports = {
    message: message
};

/*
 * Corresponds to the /workspaces/{id}/message REST API.
 * Invoked via the Swagger API. This proxy function checks if a callout object has
 * been registered with the app. A callout if registered may optionally inject itself
 * into the request lifecycle by registering callbacks which get invoked before Dialog
 * is called and after Dialog is called.
 */
function message (req, res) {
    var id = req.swagger.params.workspace_id.value;
    var input = req.swagger.params.input.value.input;
    var state = req.swagger.params.input.value.state;
    var tags = req.swagger.params.input.value.tags;
    var payload = {'workspace_id': id, 'input': input, 'tags': tags, 'state': state};
    var beforeCallDialog = req.beforeCallDialog;
    if ( beforeCallDialog ) {
        //If a callout handler has been defined, call it first, with the payload.
        beforeCallDialog ( payload, function (newPayload) {
            callDialog ( res, newPayload, req.afterCallDialog );
        } );
    }
    else {
        callDialog ( res, payload, req.afterCallDialog );
    }
}

/*
 * Private function which uses the Watson Services platform SDK to make requests to the
 * Dialog service.
 */
function callDialog (res, payload, afterCallDialog) {
    var dialog = watson.dialog ( {
        'version': 'v2',
        'url': 'https://gateway-s.watsonplatform.net/dialog-beta/api'
    } );
    var input = payload.input;
    if(!input){
        delete payload.input;
    }

    dialog.message ( payload, function response (error, result, response_message) {
        if ( result ) {
            result.input = input;
        }
        if ( afterCallDialog ) {
            //If a callout handler has been defined, call it once a response is receied from dialog.
            afterCallDialog ( error, result, function (error, result) {
                res.format ( {
                    "json": function () {
                        res.send ( result )
                        res.end ();
                    }
                } );
            } );
        }
        else {
            res.format ( {
                "json": function () {
                    res.send ( result );
                    res.end ();
                }
            } );
        }
    } );
}
