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

//AUTOGENERATED CODE! See template in proxy/templates/index.mustache

'use strict';

//Web app
var app = require ( 'connect' ) ();
var http = require ( 'http' );
//Swagger middleware function. Adds REST endpoints to the app server based on the
//API definition in the ./swagger/swagger.yaml file
var initializeSwagger = require ( 'swagger-tools' ).initializeMiddleware;
var jsyaml = require ( 'js-yaml' );
var fs = require ( 'fs' );
var cfEnv = require ( 'cfenv' );
var swagger_controller = require ( './controllers/proxy_controller' );

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync ( __dirname + '/api/swagger.yaml', 'utf8' );
var swaggerDoc = jsyaml.safeLoad ( spec );

exports = module.exports = startProxy;

/*
 * Starts the proxy server. The function provides flexibility around how the proxy server is consumed.
 * The client may optionally pass in a pre-configured web server (express, connect etc) via the 'app'
 * variable. This web app will then be used by the swagger runtime to route REST requests as defined
 * in the swagger API doc.
 * The client may optionally set the callback which gets invoked once the web server is started via
 * the serverStartCallback callback.
 * The client may set the port on which the http server is started, via the port variable,
 * 10010 by default.
 * The client may optionally turn off the Swagger UI for API documentation via the hideSwaggerDoc
 * property (defaults to false).
 *
 * var options = {
 *                'app': your_web_server_app,
 *                'serverStartCallback': function(){//some code which gets executed once server starts},
 *                'port': port_to_listen_on,
 *                'hideSwaggerDoc': true
 *                }
 *
 * If one (or all) options are not defined then a default is used by the proxy
 */
function startProxy (options) {
    options = options || {};
    var serverPort = options.port || cfEnv.getAppEnv ().port || 10010;
    var webApp = options.app || app;
    var serverStartCallback = options.serverStartCallback;
// Initialize the Swagger middleware
    initializeSwagger ( swaggerDoc, function (middleware) {
// Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        var metadata = middleware.swaggerMetadata ();
        webApp.use ( metadata );

        webApp.use ( function (req, res, next) {
            if ( options.beforeCallDialog ) {
                req.beforeCallDialog = options.beforeCallDialog;
            }
            if ( options.afterCallDialog ) {
                req.afterCallDialog = options.afterCallDialog;
            }
            next ();
        } );

// Validate Swagger requests
        webApp.use ( middleware.swaggerValidator () );

// Route validated requests to appropriate controller
// swaggerRouter configuration
        var swaggerOptions = options.swaggerOptions || {
                swaggerUi: '/swagger.json',
                controllers: __dirname + '/controllers',
                useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
            };

        var router = middleware.swaggerRouter ( swaggerOptions );
        webApp.use ( router );
        swagger_controller.beforeCallDialog = options.beforeCallDialog;
        swagger_controller.afterCallDialog = options.afterCallDialog;
        if ( !options.hideSwaggerDoc ) {
// Serve the Swagger documents and Swagger UI
            webApp.use ( middleware.swaggerUi () );
        }
// Start the server
        http.createServer ( webApp ).listen ( serverPort, serverStartCallback || function () {
                console.log ( 'Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort );
                if ( !options.hideSwaggerDoc ) {
                    console.log ( 'Swagger-ui is available on http://localhost:%d/docs', serverPort );
                }
            } );
    } );
}
