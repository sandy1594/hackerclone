const express = require('express');
const app =express();
app.use(express.static("public"));
app.set("view engine","ejs");
var path = require('path');
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://sandy1:sandy123@cluster0.u7hyf.mongodb.net/<dbname>?retryWrites=true&w=majority",{
    useNewUrlParser:true,useUnifiedTopology: true,
},function(error){
  if(error){
      console.log(error);
  }  else{
      console.log("connected to db");
  }
});
var gameSchema= new mongoose.Schema({
    title:String,
    creator:String,
    type:String
});
var Game = mongoose.model("Game",gameSchema);
Game.create({
    title:"shooter",
    creator:"me",
    type:"action"

}, function(error,data){
    if(error){
        console.log("there is a problem in adding collections");
        console.log("error");

    }else{
        console.log("data is added to collection")
        console.log(data)
           
       
    }
});

Game.find({},function(error,data){
    if(error){
        console.log("prblm in finding data");

    }else{
        console.log("here is alldata")
        console.log(data)
    }
})





app.set('views',path.join(__dirname, 'views'));
const  bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));
app.get("/",function(req,res){
    res.render("homepage")
})









app.get("/edit/:id", function(req, res){
    var id = req.params.id;

    Game.findById(id, function(error, foundGame){
        if(error){
            console.log("Couldn't find game with that id:");
        }else{
            res.render("edit", {
                title: foundGame.title,
                creator: foundGame.creator,
                type: foundGame.type,
              
                id: id
            });
        }
    });
});


   
  

app.post("/update/:id", function(req, res){
    var id = req.params.id;

    Game.findByIdAndUpdate(id, {
        title: req.body.title,
        creator: req.body.creator,
        type: req.body.type,
      
    }, function(err, updatedGame){
        if(err){
            console.log("Couldnt update game");
            console.log(err);
        }else{
            res.redirect("/gamelist");
            console.log("Updated Game: " + updatedGame);
        }
    })
});

 app.get("/del/:id",function(req,res){
     var id= req.params.id;
     Game.findByIdAndDelete(id,function(err){
         if(err){
             console.log("error deleting");
             console.log(err);

         }else{
             console.log("deleted from database")
                 res.redirect("/gamelist")
            }
     })
 });

 app.get("/gamelist",function(req,res){

    Game.find({},function(error,games){
        if(error){
            console.log("there was a problem retriving data frm db")
            console.log(data)
        }else{
            res.render("gamelist",{
                gamelist:games
         });

        }
    });
       
         
    });

    app.get("/addgame",function(req,res){
        res.render("addgame")
    });
    app.post("/addgame",function(req,res){
        var data= req.body;

       Game.create({
        title:data.title,
        creator:data.creator,
        type:data.type
       },function(error,data){
           if(error){
            console.log("ther is aproblem in adding to db")

           }else{
            console.log("data is added to db")
               console.log(data)
           }

            
       })
        res.redirect("/gamelist")
    });

app.get("*",function(req,res){
    res.send("error route doesnt exist")
});


app.listen(3000,()=>console.log("node js running"));





 