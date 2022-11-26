//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB")
 const itemsSchema = {
  name: String
 }
 const Item = mongoose.model("Item",itemsSchema);
 
 const item1 = new Item(
  {
    name: "welcome to your todolist!"
  }
 );
 const item2 = new Item({
  name:"hit the + button to add a new item."
 });
 const item3 = new Item({
  name: "<-- hit this to delete on item."
 })
 const defaultItems = [item1,item2,item3];
  const listSchema = {
    name :"string",
    items: [itemsSchema]
  };

 const List = mongoose.model("List",listSchema)
app.get("/", function(req, res) {
 Item.find({},function(err,items){
  if (items.length === 0){
    Item.insertMany(defaultItems,function(err){
      if(!err){
        console.log("sucessfully inserted")
      }
      
   });
   res.redirect("/")

  }else{
    res.render("list", {listTitle: "Today", newListItems: items});
  }
  
  
  
  
 })
  



});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
 const item = new Item({
  name: itemName
 })
 item.save();
 res.redirect("/")

 

 
});

app.post("/delete",function(req, res){
  const checkedItemid = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemid, function(err){
    if(!err){
      res.redirect("/")
    }
  });
});

app.get("/:customlist", function(req, res){

  const customlist = req.params.customlist;

 
  console.log(customlist)
  
  
  List.findOne({name: customlist}, function(err,results){
    console.log(results)
    if(!err){
      if(results.name == null){
         const list =new List({
         name : customlist,
         items: defaultItems

           });
        list.save();
        
        

      }else{
        const title = results.name
     const items = results.items
     res.render("list", {listTitle: title, newListItems: items});
      }
     

   }


})
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
