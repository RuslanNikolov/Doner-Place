const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.displayProducts);
    app.get('/about', restrictedPages.hasRole('Admin'), controllers.home.about);
    app.get('/register', controllers.user.registerGet);
    app.post('/register', controllers.user.registerPost);
    app.post('/logout', controllers.user.logout);
    app.get('/login', controllers.user.loginGet);
    app.post('/login', controllers.user.loginPost);

    //Admin
    app.get('/createProduct',restrictedPages.hasRole('Admin'),controllers.admin.viewCreateProduct)
    app.post('/createProduct',restrictedPages.hasRole('Admin'),controllers.admin.createProduct)
    app.get('/showOrders',restrictedPages.hasRole('Admin'),controllers.admin.showOrders)
    app.post('/showOrders',restrictedPages.hasRole('Admin'),controllers.admin.changeOrders)

    //Duners
    app.get('/showViewOrder/:id',restrictedPages.isAuthed,controllers.user.showViewOrder)
    
    //Details
    app.post('/showViewOrder/:id',restrictedPages.isAuthed,controllers.user.customizeOrder)
    app.get('/orderDetails/:id',restrictedPages.isAuthed,controllers.user.showDetails)
    

    //Status
    app.get('/showStatus',restrictedPages.isAuthed,controllers.user.showStatus)

    

    



    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};