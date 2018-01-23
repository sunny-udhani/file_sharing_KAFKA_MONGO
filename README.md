# Online File Sharing
A web application imitating features of dropbox with Apache Kafka for distributed message streaming, MongoDB as datastore and PassportJS as authentication middleware.

> Individual academic project for Graduate software engineering course 273 - Enterprise Distributed Systems.

## Goal

* The goal is to build a distributed enterprise web application which enables the user not only to upload , star/unstar or delete files but also share files to other users, create groups, add/edit/delete members and view their own activity timeline.

* We were tasked with this project requirement so that we can learn and develop enterprise service application and also non-relational databases.

## System Design

> Applications uses a simple Client-Server architecture where there are as many as 13 React components, 17 API’s  and 20+ kafka topics to support different functionalities.

My application includes 20+ kafka topics responsible to perform different activities. There are different consumers for each topic so that no one consumer gets overloaded with large number of requests on multiple topics. The system architecture is divided into 3 parts,
  
  1.)	dropbox_react
  2.)	dropbox-kafka-client
  3.)	dropbox-kafka-server
  
Here, the kafka-client part only does the part of producing messages and on response from kafka-server forward it to react side.
It also includes implementation of passportjs’s local strategy for authentication.  Sessions are stored in MongoDB and I have used express-sessions for session management.

Implemented a personal version of connection pooling for the application.


### Technology stack

<table>
<thead>
<tr>
<th>Area</th>
<th>Technology</th>
</tr>
</thead>
<tbody>
	<tr>
		<td>Front-End</td>
		<td>React, Redux, React Router, Bootstrap, HTML5, CSS3, Javascript ( ES6 )</td>
	</tr>
	<tr>
		<td>Back-End</td>
		<td> Express, Node.js</td>
	</tr>
  <tr>
		<td>Message Streaming</td>
		<td>Apache Kafka</td>
	</tr>
  <tr>
		<td>Authentication Middleware</td>
		<td>PassportJS</td>
	</tr>
	<tr>
		<td>API Testing</td>
		<td>Mocha, Postman</td>
	</tr>
  <tr>
		<td>Session Management</td>
		<td>express-sessions and MongoDB</td>
	</tr>
	<tr>
		<td>Database</td>
		<td>MongoDB</td>
	</tr>
	<tr>
		<td>Performance Testing</td>
		<td>JMeter</td>
	</tr>
</tbody>
</table>
<br/>

