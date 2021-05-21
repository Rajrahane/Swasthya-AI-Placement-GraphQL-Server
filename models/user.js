const dbConnection=require('../dbConnection/dbConnection');
const {DataTypes}=require('sequelize');
const User=dbConnection.define('user',{
    first_name:{
        type:DataTypes.STRING(30),
    },
    last_name:{
        type:DataTypes.STRING(30),
    },
    email_address:{
        type:DataTypes.STRING(100),
        unique:{
            args:true,
            msg:'Email address already in use'
        },
        allowNull:false,
        validate:{
            isEmail:{
                args:true,
                msg:"Please enter valid email address"
            }
        }
    },
    mobile_number:{
        type:DataTypes.STRING(10),
        validate:{
            len:{
                args:[10,10],
                msg:"enter 10 digits"
            },
            isNumeric:{
                msg:"Enter digits only"
            }
        }
    }
},{
    timestamps:false,
    freezeTableName:true
});
module.exports=User;