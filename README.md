# Swasthya-AI-Placement-GraphQL-Server-
GraphQL server for Swasthya AI Placement Assignment

Visit the <a href='https://github.com/Rajrahane/Swasthya-AI-Placement-React-Server'>React Client Repository</a>

Run the MYSQL script on MySQL Workbench<br>
Steps to install and run GraphQL and React Servers:<br>
1. clone the repository (git clone repo.git)
2. run npm install
3. change the username,password for GraphQL dbConnection/dbConnection.js
4. run npm start
5. view the GraphQL server on localhost:4000/graphql
6. view the React Server on localhost:3000/

Approach:<br>
Create 3 tables: User, Blog and Comment<br>
User Table: id,first_name,last_name,mobile_number,email_address<br>
Blog Table: id,name<br>
Comment Table: id,message,user_id,blog_id<br>
Friends Table: id,user_id,friend_id<br>
Friends table adds a given friend to the user's friendList.<br>
Considering friends is undirected connection,two entries would be made- for a pair of friends A,B as (A,B) and (B,A).

React UI:<br>
/users Endpoint: User can Register, Search, View Profile<br>
/blogs Endpoint: A new Blog can be created.Search Blog based on ID.<br>
Blog Profile shows blog name and lists the comments.<br>

Create a DB schema in MYSQL for the tables.<br>
Create a GraphQL Schema to fetch data, create new User and Blog, post a new Comment.<br>
Create a React Frontend for Forms, Search, Profile.<br>
----<br>
Solution for nth Level Friend List:<br>
Create a Friends graph and make a BFS recursive call until nth level.<br>
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
Improvements:<br>
DFS can be used instead of BFS if some(say 10) and not all users are to be fetched.<br>
Graph DB - Neo4j can be used instead of MySQL, since a friends graph is formed<br>
Pagination can be used to fetch Comments from GraphQL.<br>
GraphQL caching can be used for query caching<br>
<br>
Deployment:<br>
GraphQL can be hosted over AWS Lambda + API Gateway<br>
Jenkins CI/CD can be setup for Deployment of Lambda Code from Repository<br>
