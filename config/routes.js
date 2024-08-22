module.exports = {
    //auth
    login: '/account/auth/login',
    register: '/account/auth/register',

    //posts
    posts:{
        index:'/posts',
        id:'/posts/post',
        new:'/posts/new',
    },
    
    //admin
    admin:{
        index:'/admin',
        crud:'/admin/crud',
        category: {
            index: '/admin/crud/category',
            create:'/admin/crud/category/create',
            update:'/admin/crud/category/update',
            delete:'/admin/crud/category/delete',
        },
        reports:'/admin/reports',
    } 
};