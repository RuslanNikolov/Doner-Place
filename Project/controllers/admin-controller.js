const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Product = require('../models/Product')
const Order = require('../models/Order')


module.exports = {
    viewCreateProduct:(req,res)=>{
        res.render('views/create-product')
    },
    createProduct:(req,res)=>{
        if(req.body.size < 17 || req.body.size > 24){
         let displayMessage = 'Invalid size'
         res.render('views/create-product',{displayMessage})
         return
        }
        
        let toppings = req.body.toppings
        let arrToppings = toppings.split(',')
        req.body.toppings = arrToppings
        
        
        
        let newObj = req.body
        
        
        Product.create(newObj).then((newDuner)=>{
            
            res.redirect('/')
        }
        )
        .catch((e)=>console.log(e))

 },
 showOrders:(req,res)=>{
    let orders =[]
      Order.find({}).populate('Product').then((foundOrders)=>{
       
         for(let order of foundOrders){
          let ordObj = {}
          ordObj.dateOfOrder = order.dateOfOrder
          ordObj.status = order.status
          
          let id = order.product
          Product.findOne({_id:id}).then((product)=>{
             
              ordObj.size = product.size
              ordObj.category = product.category
              ordObj.toppings = product.toppings
              let date = ordObj.dateOfOrder;
              let newDate = date.toLocaleString()
              ordObj.simpleDateOfOrder = newDate.substring(0, 18)
              orders.push(ordObj)
                  
          })
          
         }
        
         
        
     })
     setTimeout(function(){res.render('views/show-orders-admin',{orders})},500)
     
    },
 changeOrders:(req,res)=>{
     
     let statuses = req.body['59e8ea04906b6628acbf9d29']
     

     Order.find({}).then((foundOrders)=>{
         let count = 0
        for (i = 0; i < foundOrders.length; i++) { 
            foundOrders[i].status = statuses[i]
            foundOrders[i].save()
      }
     })
    res.redirect('back')
 }
}
