const express=require('express');
const graphqlHTTP=require('express-graphql');
const schema=require('./schema/schema');
const cors=require('cors');
//get express object
const app=express();

//allow cross-origin requests
app.use(cors());

//setup endpoint /graphql
app.use('/graphql',graphqlHTTP({
    schema:schema,
    graphiql:true
}));
//listen to port 4000
app.set('port',process.env.port||4000)
app.listen(app.get('port'),()=>{
    console.log("now listening to port "+app.get('port'));
});