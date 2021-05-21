const dbConnection=require('../dbConnection/dbConnection');
const {DataTypes}=require('sequelize');
const Comment=dbConnection.define('comment',{
    message:{
        type:DataTypes.STRING(512),
    },
    blog_id:{
        type:DataTypes.INTEGER(11),
        allowNull:false,
    },
    user_id:{
        type:DataTypes.INTEGER(11),
        allowNull:false,
    },
},{
    timestamps:false,
    freezeTableName:true
});
module.exports=Comment;