let Router = require('express').Router;
const apiRouter = Router()

/*
 * Note: the model for the data-table should not have the name 'Resource'
 */
let Resource = require('../db/schema.js').Resource

apiRouter
 .get('/products', function(req, res){
   Resource.find(req.query , function(err, results){
     if(err) return res.json(err)
     res.json(results)
   })
 })

 .post('/products', function(req, res){
     let newRecord = new Resource(req.body)

     newRecord.save(function(err, record){
        if(err) return res.status(500).send('server/db error on attempt to save user to db')
        let userCopy = newRecord.toObject()
        delete userCopy.password
        res.json(userCopy)
     })
 })


apiRouter
 .get('/products/:_id', function(req, res){
   Resource.findById(req.params._id, "-password", function(err, record){
     if(err || !record ) return res.json(err)
     res.json(record)
   })
 })

 .put('/products/:_id', function(req, res){

   Resource.findByIdAndUpdate(req.params._id, req.body, function(err, record){
       if (err) {
         res.status(500).send(err)
       }
       else if (!record) {
         res.status(400).send('no record found with that id')
       }
       else {
         res.json(Object.assign({},req.body,record))
       }
   })
 })

 .delete('/products/:_id', function(req, res){
   Resource.remove({ _id: req.params._id}, (err) => {
     if(err) return res.json(err)
     res.json({
       msg: `record ${req.params._id} successfully deleted`,
       _id: req.params._id
     })
   })
 })

 // TO DELETE ALL:
 // .delete("/resources/all/records", function(req, res){
 //   Resource.remove({}, (err) => {
 //     if(err) return res.json(err)
 //     res.json({
 //       msg: `EVEYTHING successfully deleted`
 //     })
 //   })
 // })

module.exports = apiRouter
