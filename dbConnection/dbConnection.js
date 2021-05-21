const {Sequelize}=require('sequelize');
const connection=new Sequelize(process.env.DB || 'blog_system',
process.env.DB_USERNAME || 'root',
process.env.DB_PASSWORD ||'vis$',{
    host:process.env.DB_HOST ||'localhost',
    port:3306,
    dialect:"mysql"
});
module.exports = connection;