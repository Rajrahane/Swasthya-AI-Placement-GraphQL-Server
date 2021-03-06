# Swasthya-AI-Placement-GraphQL-Server
GraphQL server for Swasthya AI Placement Assignment<br>
<h3>Running Servers on EC2:</h3>
http://18.206.209.243:3000/<br>
http://18.206.209.243:4000/graphql<br>
<br>
Visit the <a href='https://github.com/Rajrahane/Swasthya-AI-Placement-React-Server'>React Client Repository</a>

Run the MYSQL script `dump_2329_22052021.sql` on MySQL Workbench<br>
Steps to install and run GraphQL and React Servers:<br>
1. clone the repository (`git clone https://github.com/Rajrahane/Swasthya-AI-Placement-GraphQL-Server.git`)
2. run `npm install`
3. change the username,password for GraphQL dbConnection/dbConnection.js
4. run `npm start`
5. view the GraphQL server on http://localhost:4000/graphql
6. view the React Server on http://localhost:3000/

<h4>Approach:</h4>
<b>DB Schema:</b>
<img src="output/dbDiagramJPG.JPG">
Create 4 tables: User, Blog, Comment, Friend<br>
<ul>
<li>User Table: id,first_name,last_name,mobile_number,email_address</li>
<li>Blog Table: id,name</li>
<li>Comment Table: id,message,user_id,blog_id</li>
<li>Friend Table: id,user_id,friend_id<br>
Friend table adds a given friend to the user's friendList.</li>
  </ul>
Assumption: Friends is undirected connection,two entries would be made- for a pair of friends A,B as (A,B) and (B,A).
<br><br>
<b>React UI:</b><br>
/users Endpoint: User can Register, Search, View Profile<br>
/blogs Endpoint: A new Blog can be created.Search Blog based on ID.<br>
Blog Profile shows blog name and lists the comments.<br>
<br>
<b>Summary</b><br>
<ul>
<li>Create a DB schema in MYSQL for the tables.</li>
<li>Create a GraphQL Schema to fetch data, create new User and Blog, post a new Comment.</li>
<li>Create getFriends RootQuery in GraphQL to fetch Nth Level Friend of a User</li>
<li>Create a React Frontend for Forms, Search, Profile.</li>
</ul>
<hr>
<b>Solution for Nth Level Friend List:</b><br>
Create a Friends graph and make a BFS recursive call until Nth level.<br>
<pre>
Consider input as (user_id:int,givenLevel:int) returns list(users)
   Initialize an empty Set of VisitedUsers
   Initialize an empty queue.Push (user_id) into it
   Initialize currentLevel=0
   while(q is not empty and currentLevel lessthan givenLevel){
      init new empty queue q2
      while(q not empty){
        pop each user.
        if(user not visited){
            mark as visited in VisitedUsers
            fetch all friends ids from Friends table in Database
            foreach(friend){
              if(friend not visited){
                push friend to queue q2
              }
            }
         }
      }
      currentLevel++
      push all elements in q2 to q, i.e. q=q2
   }
   if(currentLevel less than givenLevel){ //no nth level depth possible, too few levels
      return empty list
   }
   return to_list(q)
</pre>
<hr>
<b>Sample Database Data:</b><br>
1. 7 users are created<br>
2. 2 blogs are created<br>
3. 1st blog has 2 comments added<br>
4. To mock friend relations, 6 relations are created {1,2,3}, {1,4}, {4,6}, {4,5}<br>
<img src="output/UsersGraph.png">
<img src="output/BasicUserQuery.JPG">
<hr>
<b>Sample GraphQL Query for getFriends at any level:</b>
<pre>
{
  getFriends(input:{
    user_id:5
    level:3
  }){
    id
    last_name
  }
}
</pre>
Expected Output: Users 2 and 3<br>
Explanation: User 5 has 1st level friend- User 4<br>
User 5 has 2nd level friends- User 1,6 via User 4<br>
User 5 has 3rd level friends- User 2,3 via User 1<br>
<img src="output/sampleQuery.JPG">
<hr>
<b>Sample Query for edge case (level too high or level<=0)</b>
<pre>
{
  getFriends(input:{
    user_id:5
    level:4
  }){
    id
    last_name
  }
}
</pre>
Expected Ouput: null list<br>
Explanation: User 5 has friends upto level 3 only
 <img src="output/LevelTooHigh.JPG">
 <img src="output/Level0.JPG">
<hr>
Features of GraphQL Repository
  <ul>
    <li>Uses <a href="https://expressjs.com/">Express</a> NPM Package for Server Setup</li>
    <li>Uses <a href="https://graphql.org/">GraphQL</a> to create Schema and Query, Mutation operations</li>
    <li>Uses <a href="https://sequelize.org/">Sequelize</a> a Promise based Node.js ORM</li>
  </ul>
 Features of ReactJS Repository
    <ul>
      <li>Uses <a href="https://www.apollographql.com/docs/react/">ApolloClient</a> to connect to GraphQL Server</li>
      <li>Uses <a href="https://reactrouter.com/web/guides/quick-start">React Router</a> for creating Routes Hierarchy</li>
      <li>Uses <a href="https://react-bootstrap.github.io/">React Bootstrap</a> for Bootstrapping </li>
    </ul>

<b>Improvements:</b><br>
   <ul>
   <li><b>DFS</b> can be used instead of BFS if some(say 10) and not all users are to be fetched.</li>
   <li><b><a href="https://neo4j.com/developer/graph-database/">Graph DB - Neo4j</a></b> can be used instead of MySQL, since a friends graph is formed</li>
<li>Pagination can be used to fetch Comments from GraphQL.</li>
<li><b>GraphQL caching</b> can be used for query caching</li>
</ul>
<b>Deployment:</b><br>
   <li>GraphQL can be hosted over <a href="https://aws.amazon.com/lambda/">AWS Lambda</a> + <a href="https://aws.amazon.com/api-gateway/">API Gateway</a></li>
<li><a href="https://aws.amazon.com/cdk/">AWS CDK</a> or <a href="https://aws.amazon.com/serverless/sam/">AWS SAM</a> can be setup for Deployment of Lambda Code from Repository</li>
<hr>
<b>React JS UI Snaps</b>
<img src="output/BlogProfile.JPG">
<img src="output/UserSearch.JPG">

  EC2 Deployment
<ul>
  <li>Launch EC2 using Amazon AWS console.Open ports 4000(GraphQL),3000(React),22(SSH)</li>
  <li>SSH into it. install <a href="https://git-scm.com/">git</a> `sudo yum install git -y`</li>
  <li><a href="https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html">install node using nvm</a></li>
  <li>install <a href="https://pm2.keymetrics.io/">pm2</a> Daemon Process Manager. `npm install pm2 -g`</li>
  <li>git pull both repositories(React and GraphQL)</li>
  <li><a href="https://docs.aws.amazon.com/AmazonECS/latest/developerguide/docker-basics.html">Install Docker on EC2</a></li>
  <li>
    <a href="https://docs.docker.com/compose/install/">Install docker-compose(linux)</a><br>
    `sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`<br>
    `sudo chmod +x /usr/local/bin/docker-compose`<br>
    `docker-compose --version`
  </li>
  <li><b>Deploy DB using Docker:</b>In /deployment folder: `cd deployment`, `docker-compose up -d` This launches a mysql db and connects a persistent docker volume to it</li>
  <li><b>Deploy GraphQL using pm2</b>:in graphql repository: `pm2 start --name swasthya-ai-graphql-server npm -- start`</li>
  <li><b>Deploy React using pm2:</b>in react repository:change graphql endpoint in src/index.js to http://18.206.209.243:4000/graphql then `pm2 start --name swasthya-ai-react-server npm -- start`</li>
  </ul>
