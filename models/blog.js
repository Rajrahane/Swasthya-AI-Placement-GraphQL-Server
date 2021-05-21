const dbConnection=require('../dbConnection/dbConnection');
const {DataTypes}=require('sequelize');
const Blog=dbConnection.define('blog',{
    name:{
        type:DataTypes.STRING(256),
    }
},{
    timestamps:false,
    freezeTableName:true
});
module.exports=Blog;