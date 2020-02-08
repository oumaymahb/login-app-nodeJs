const mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    nom:{
        type: String
    },
    prenom:{
        type:String
    },
    utilisateur:{
        type:String
    },
    motdepasse:{
        type:String
    },
    adresse:{
        type:String
    },
    telephone:{
        type:String
    }
    });
    var user=mongoose.model('user',userSchema,'user');
    module.exports=user;