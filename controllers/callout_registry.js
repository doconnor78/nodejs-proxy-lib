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

module.exports = {
  register: register,
  getBeforeCallDialog: getBeforeCallDialog,
  getAfterCallDialog: getAfterCallDialog
};

var _handler;
function register(handler) {
  _handler = handler;
}

function getBeforeCallDialog(){
	if(_handler && _handler.beforeCallDialog){
		return _handler.beforeCallDialog;
	}
	return null;
}

function getAfterCallDialog(){
	if(_handler && _handler.afterCallDialog){
		return _handler.afterCallDialog;
	}
	return null;
}