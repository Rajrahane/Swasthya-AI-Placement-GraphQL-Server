const graphql=require('graphql');
const UserModel = require('../models/user');
const CommentModel=require('../models/comment')
const BlogModel=require('../models/blog');
const FriendModel = require('../models/friend');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLID,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLInputObjectType
}=graphql

const UserType=new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{type:GraphQLID},
        first_name:{type:GraphQLString},
        last_name:{type:GraphQLString},
        email_address:{type:GraphQLString},
        mobile_number:{type:GraphQLString},
        comments:{
            type:new GraphQLList(CommentType),
            resolve(parent){
                return CommentModel.findAll({
                    where:{
                        user_id:parent.id
                    }
                })
            }
        },
        friends:{
            type:new GraphQLList(FriendType),
            resolve(parent){
                return FriendModel.findAll({
                    where:{
                        user_id:parent.id
                    }
                })
            }
        }
    })
})
const UserInputType=new GraphQLInputObjectType({
    name:'UserInput',
    fields:()=>({
        id:{type: GraphQLInt},
        //id field added to reuse UserInputType for updateUser,deleteUser
        first_name:{type: GraphQLString},
        last_name:{type: GraphQLString},
        mobile_number:{type: GraphQLString},
        email_address:{type:GraphQLString},
    })
});

const BlogType=new GraphQLObjectType({
    name:'Blog',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        comments:{
            type:new GraphQLList(CommentType),
            resolve(parent){
                return CommentModel.findAll({
                    where:{
                        blog_id:parent.id
                    },
                    order:[
                        ['id','DESC']
                    ]
                })
            }
        },
        totalComments:{
            type:GraphQLInt,
            resolve(parent){
                return CommentModel.count({
                    where:{
                        blog_id:parent.id
                    }
                })
            }
        },
        usersCount:{
            type:GraphQLInt,
            resolve(parent){
                return CommentModel.count({
                    distinct:true,
                    col:'user_id',
                    where:{
                        blog_id:parent.id
                    }
                })
            }
        }
    })
})
const BlogInputType=new GraphQLInputObjectType({
    name:'BlogInput',
    fields:()=>({
        id:{type: GraphQLInt},
        name:{type: GraphQLString}
    })
});

const CommentType=new GraphQLObjectType({
    name:'Comment',
    fields:()=>({
        id:{type:GraphQLID},
        message:{type:GraphQLString},
        blog_id:{type:GraphQLInt},
        blog:{
            type:BlogType,
            resolve(parent){
                return BlogModel.findByPk(parent.blog_id)
            }
        },
        user_id:{type:GraphQLInt},
        user:{
            type:UserType,
            resolve(parent){
                return UserModel.findByPk(parent.user_id)
            }
        }
    })
})
const CommentInputType=new GraphQLInputObjectType({
    name:'CommentInput',
    fields:()=>({
        id:{type: GraphQLInt},
        message:{type: GraphQLString},
        user_id:{type:GraphQLInt},
        blog_id:{type:GraphQLInt}
    })
});
const FriendAtLevelInputType=new GraphQLInputObjectType({
    name:'FriendAtLevelInput',
    fields:()=>({
        user_id:{type:new GraphQLNonNull(GraphQLInt)},
        level:{type:new GraphQLNonNull(GraphQLInt)}
    })
})
const FriendType=new GraphQLObjectType({
    name:'Friend',
    fields:()=>({
        id:{type:GraphQLID},
        friend_id:{type:GraphQLInt},
        friend:{
            type:UserType,
            resolve(parent){
                return UserModel.findByPk(parent.friend_id)
            }
        },
        user_id:{type:GraphQLInt},
        user:{
            type:UserType,
            resolve(parent){
                return UserModel.findByPk(parent.user_id)
            }
        }
    })
})
const RootQuery=new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        user:{
            type:UserType,
            args:{id:{type:GraphQLID}},
            resolve(_,args){
                return UserModel.findByPk(args.id);
            }
        },
        users:{
            type:new GraphQLList(UserType),
            resolve(){
                return UserModel.findAll();
            }
        },
        comments:{
            type:new GraphQLList(CommentType),
            resolve(){
                return CommentModel.findAll()
            }
        },
        blogs:{
            type:new GraphQLList(BlogType),
            resolve(){
                return BlogModel.findAll()
            }
        },
        blog:{
            type:BlogType,
            args:{id:{type:GraphQLID}},
            resolve(_,args){
                return BlogModel.findByPk(args.id);
            }
        },
        totalUsers:{
            type:GraphQLInt,
            resolve(){
                return UserModel.count()
            }
        },
        totalBlogs:{
            type:GraphQLInt,
            resolve(){
                return BlogModel.count()
            }
        },
        getFriends:{
            type:new GraphQLList(UserType),
            args:{
                input:{type:new GraphQLNonNull(FriendAtLevelInputType)},
            },
            async resolve(_,args){
                const {user_id,level}=args.input
                if(level<=0)throw new Error('Level must be greater than 0')
                visitedUsers=new Set()
                let userQueue=[]
                let currentLevel=0
                userQueue.push(user_id)
                visitedUsers.add(user_id)
                while(currentLevel<level && userQueue.length>0){
                    console.log("userQueue",userQueue)
                    let secondQueue=[]
                    for(var currentUser of userQueue){
                        console.log("currentUser",currentUser)
                        {
                            await FriendModel.findAll({
                                where:{
                                    user_id:currentUser
                                }
                            })
                            .then(friends=>{
                                console.log(JSON.stringify(friends))
                                friends.forEach(friend=>{
                                    if(!visitedUsers.has(friend.friend_id)){
                                        visitedUsers.add(friend.friend_id)
                                        console.log("added",friend.friend_id)
                                        secondQueue.push(friend.friend_id)
                                    }
                                })
                            })
                        }
                    }
                    console.log("Values",currentLevel,secondQueue)
                    currentLevel+=1
                    userQueue=secondQueue
                }
                if(currentLevel<level)return null
                return UserModel.findAll({
                    where:{
                        id:userQueue
                    }
                })
            }
        }
    }
})

const Mutation=new GraphQLObjectType({
    name:'Mutation',
    fields:{
        createUser:{
            type:UserType,
            args:{
                user:{type:new GraphQLNonNull(UserInputType)}
            },
            resolve:async (_,args)=>{
                return await UserModel.create(args.user)
                .then((user)=>{
                    return user;
                }).catch(_=>{
                    const {id,email_address}=args.user
                    throw new Error(`User with ID: ${id}
                     and Email ID: ${email_address} could not be registered`)
                });
            }
        },
        createBlog:{
            type:BlogType,
            args:{
                blog:{type:new GraphQLNonNull(BlogInputType)}
            },
            resolve:async (_,args)=>{
                return await BlogModel.create(args.blog)
                .then((blog)=>{
                    return blog;
                }).catch(_=>{
                    const {name}=args.blog
                    throw new Error(`Blog with Name: ${name} could not be registered`)
                });
            }
        },
        postComment:{
            type:CommentType,
            args:{
                comment:{type:new GraphQLNonNull(CommentInputType)}
            },
            resolve:async (_,args)=>{
                const {user_id,blog_id,message}=args.comment
                const newComment= await CommentModel.create(args.comment)
                .then(_,_=>{
                    throw new Error(`Comment with User ID: ${user_id} Blog ID: ${blog_id}
                        and Message: ${message} could not be posted`)
                })
                return newComment
            }
        }
    }
})
module.exports=new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
});