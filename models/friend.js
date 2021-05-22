const dbConnection=require('../dbConnection/dbConnection');
const {DataTypes}=require('sequelize');
const Friend=dbConnection.define('friend',{
    friend_id:{
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
module.exports=Friend;