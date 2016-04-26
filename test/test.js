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
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./../index');
var should = chai.should();
chai.use(chaiHttp);


describe('message', function() {
 it('should add a message on /message POST', function(done) {
   var wid = 8769;
   chai.request(server)
    .post('/v2/workspaces/'+wid+'/message')
    .send({"input": { "text" : "some message"},"tags": ["tag1,tag2"],"state": {}})
    .end(function(err, res){
      res.should.have.status(200);
	  res.body.should.be.a('object');
      /*
	  res.should.be.json;
	  res.body.should.have.property('Some');
      res.body.SUCCESS.should.be.a('object');
      res.body.SUCCESS.should.have.property('name');
      res.body.SUCCESS.name.should.equal('message');
 */
      done();
    });
});
 /*it('Invalid workspaceid on /message POST', function(done) {
   var wid = 'stringid';
   chai.request(server)
    .post('/v2/workspaces/'+wid+'/message')
    .send({"input": "some message","tags": ["tag1,tag2"],"state": {}})
	.end(function(err, res){
		 if (err)return done(err);
      res.should.have.status(400);
	  res.body.should.be.a('object');
      done();
    });
});*/
});