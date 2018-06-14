const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Product = require('../models/Product')
const Order = require('../models/Order')

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);
        try {
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                roles: []
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/register');
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({ username: reqUser.username });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                    return;
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
            return;
        }


    },
    showViewOrder: (req, res, next) => {
        let productId = req.params.id
        Product.findOne({ _id: productId }).then((found) => {
            
            res.render('views/customize-order', {found})
        
        })

      
          

    },
    customizeOrder: (req, res) => {
        let orderObj = {}
        let creator = req.user.username
        let productId = req.params.id
       
        
  
       
   
        Product.findOne({ _id: productId }).then((found) => {
            orderObj.product = found
            orderObj.creator = creator
            orderObj.toppings = req.body.toppings
          
           Order.create(orderObj).then((newOrder)=>{
               let id = newOrder._id
               res.redirect(`/orderDetails/${id}`)
           })
         })
},
   showDetails:(req,res)=>{

       let id = req.params.id
       Order.findOne({_id:id}).then((order)=>{
           let status = order.status
           let check = {pending:false,inProgress:false,inTransit:false,delivered:false}
           let category = ""

           Product.findOne({ _id: order.product}).then((found) => {
            order.category = found.category
            order.imageUrl = found.imageUrl
            order.size = found.size
            let date = order.dateOfOrder;
            let newDate = date.toLocaleString()
            order.simpleDateOfOrder = newDate.substring(0, 18)
         })



           if(status === "Pending"){
               check.pending = true
           }
           else if (status === 'InProgress'){
              check.inProgress = true
           }
           else if (status === 'InTranit'){
            check.inTransit = true
        }
        else if (status === 'Delivered'){
            check.delivered = true
        }
      
        
        res.render('views/order-details',{check,order,category})
       })
       
   },
   showStatus:(req,res)=>{
       
       let user = req.user.username
       Order.find({creator:user}).then((found)=>{
        let orders = []
           for(let order of found){
           Product.findOne({_id:order.product}).then((product)=>{
            let size = product.size
            let category = product.category
            order.size = product.size
            order.category = product.category
            let date = order.dateOfOrder;
            let newDate = date.toLocaleString()
            order.simpleDateOfOrder = newDate.substring(0, 18)
            orders.push(order)
            
        })
        }
        
        res.render('views/order-status',{orders})


        
       }
    
    )
   
       
     


      
    }
}