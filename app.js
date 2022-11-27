//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const _ = require("lodash")
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
  const listTitle = req.body.list
  const item = new Item({
    name: itemName
   })

  if (listTitle === "Today"){
    item.save();
    res.redirect("/")

  }else{
    List.findOne({name:listTitle},function(err,list){
      
        list.items.push(item);
        list.save();
        res.redirect("/" + listTitle);
      
    })

  }
 
 
 

 

 
});

app.post("/delete",function(req, res){
  const checkedItemid = req.body.checkbox;
  const listTitle = req.body.ListName;
  if(listTitle === "Today"){
    Item.findByIdAndRemove(checkedItemid, function(err){
      if(!err){
        res.redirect("/")
      }
    });
  }else{
    List.findOneAndUpdate({name:listTitle},{$pull:{items:{_id:checkedItemid}}},function(err,foundList){
      if(!err){
        res.redirect("/"+ listTitle)
      }
    })

  }
  
});

app.get("/:customlist", function(req, res){

  const customlist = _.capitalize(req.params.customlist);

 
  
  
  
  List.findOne({name: customlist}, function(err,results){
   
    if(!err){
      if(!results){
         const newList = new List({
         name : customlist,
         items: defaultItems
         

           });
           
        newList.save();
        
        res.redirect("/" + customlist);
        
        

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
