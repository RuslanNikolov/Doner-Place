const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const Product = require('../models/Product')
module.exports = {
    index: (req, res) => {
        res.render('home/index');
        
    },
    about: (req, res) => {
        res.render('home/about');
    },
    displayProducts:(req,res)=>{
        let beefDuners = []
        let chickenDuners =[]
        let lambDuners = []
        Product.find({category:'beef'}).then((found)=>{
            
            for(let duner of found){
               beefDuners.push(duner)
            }
        })
        Product.find({category:'chicken'}).then((found)=>{
            for(let duner of found){
                chickenDuners.push(duner)
            }
        })
        Product.find({category:'lamb'}).then((found)=>{
            for(let duner of found){
                lambDuners.push(duner)
            }
            res.render('home/index',{beefDuners,chickenDuners,lambDuners})
        })
        
        
       

        
    }
};