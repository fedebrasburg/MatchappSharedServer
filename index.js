var express = require('express');
var app = express();
var version = 1;
var bodyParser = require("body-parser");
var connectionString = process.env.DATABASE_URL;
var pg = require('pg');
var validadores = require("./Validadores.js");

app.use(bodyParser.json({limit:'50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true })); // for parsing application/x-www-form-


app.set('port', (process.env.PORT || 5000));

//Pagina Web
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/todosLosUsuarios', function (request, response) {
    obtenerUsuarios(response,function(success,result){
    	if(success){
        	response.render('pages/todosLosUsuarios', {results: result} ); 
        }else{
        	response.render('pages/noConeccion');
        }
    });
});

app.get('/crearUsuario', function (request, response) {
    obtenerIntereses(response,function(success,intereses){
        if(success){
            obtenerCategorias(response,function(success,categorias){
                response.render('pages/crearUsuario',{categorias:categorias,intereses:intereses}); 
            });
        }else{
            response.render('pages/noConeccion');
        }
    });
});

app.get('/modificarInteres/:id/:interes/:categoria', function (request, response) {
    obtenerCategorias(response,function(success,result){
    	if(success == false){
    		response.render('pages/noConeccion');
    	}else{
        	response.render('pages/modificarInteres',{id: request.params.id, interes: request.params.interes, categoria: request.params.categoria, categorias: result}); 
    	}
    });
});

app.get('/todosLosIntereses', function (request, response) {
    obtenerIntereses(response,function(success,result){
    	if(success){
	        obtenerCategorias(response,function(success,categorias){
	            response.render('pages/todosLosIntereses', {results: result, categorias: categorias} ); 
	        });
    	}else{
    		response.render('pages/noConeccion');
    	}
    });
});

app.get('/todosLasCategorias', function (request, response) {
    obtenerCategorias(response,function(success,result){
    	if(success == false){
    		response.render('pages/noConeccion');
    	}else{
        	response.render('pages/todosLasCategorias', {results: result} ); 
    	}
    });
});

app.get('/noConeccion', function (request, response) {
	response.render('pages/noConeccion'); 
});

//Funciones comunes
function obtenerCategorias(res,callback){
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          callback(false,undefined);
        }else{
        	client.query("Select nombre as name,id from categorias",function(err,result){
	            done();
	            callback(true,result.rows);
        	});
    	}
    });
}

function escribirMetadata(count){
	if(count != undefined){
		var metadata = {'version':version,'count':count};
	}else{
		var metadata = {'version':version};
	}
	return metadata;
}

function pasarAIngles(usuario){
    var user = [];
    for (var i = 0; i < usuario.length;i++){
        var aux = {};
        aux.name = usuario[i].nombre;
        aux.alias = usuario[i].alias;
        aux.age = usuario[i].edad;
        aux.sex = usuario[i].sexo;
        aux.photo_profile = usuario[i].foto;
        aux.id = usuario[i].id;
        aux.email = usuario[i].email;
        aux.location = {};
        if(usuario[i].ubicacion != undefined){
        aux.location.latitude = usuario[i].ubicacion.latitud;
        aux.location.longitude = usuario[i].ubicacion.longitud;
        }else{
            aux.location.latitude = 2;
            aux.location.longitude = 4; 
        }
        aux.interests = usuario[i].interes;
        user.push( aux);
    }
    return user;
}
function obtenerIntereses(res,callback){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        // Handle connection errors
        if(err) {
	          done();
	          console.log(err);
	          callback(false,undefined);
        }else{
	        interests = [];
	        var query = client.query("SELECT categoria, nombre as value,id FROM interes ORDER BY id ASC");
	        query.on('row', function(row) {
	            interests.push(row);
	        });
	        query.on('end', function() {
	            if(interests.length == 0){
	                done();
	                callback(true,interests);
	            }
	            for (var i = 0; i < interests.length;i++) {
	                var u = 0;
	                var ubi = client.query("select nombre from categorias where categorias.id = "+interests[i].categoria+"", function(err, categoria) {
	                    interests[u].category = categoria.rows[0].nombre;
	                    interests[u].categoria = undefined;
	                    u++;
	                    if(u == interests.length){
	                        done();
	                        callback(true,interests);
	                    }
	                });
	            }
	        });
    	}

    });
}

function obtenerUsuarios(res,callback){
    // Get a Postgres client from the connection pool
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          callback(false,undefined);
        }else{
	        users = [];
	        var query = client.query("SELECT * FROM usuario ORDER BY id ASC");
	        query.on('row', function(row) {
	            users.push(row);
	        });
	        query.on('end', function() {
	            if (users.length == 0) {
	                done();
	                callback(true,users);
	            }
	            for (var i = 0; i < users.length;i++) {
	                var id = 0;
	                var u = 0;
	                var q = client.query("select interes.nombre as value,categorias.nombre as category from interes inner join relacioniu on relacioniu.idinteres=interes.id inner join categorias on categorias.id=interes.categoria where relacioniu.idusuario = '"+users[i].id+"'", function(err, interest) {
	                    users[id].interes = interest.rows;
	                    id++;
	                });
	                var ubi = client.query("select ubicaciones.latitud, ubicaciones.longitud from ubicaciones where ubicaciones.usuario = '"+users[i].id+"'", function(err, ubicacion) {
	                    users[u].ubicacion = ubicacion.rows[0];
	                    u++;
	                    if(u == users.length){
	                        done();
	                        callback(true,pasarAIngles(users));
	                    }
	                });
	            }
	        });
		}
    });
}

function buscarPorId(id,callback){

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return {'data':'No se encontro id'};
        }
        var usu_id = id;
        users = [];
        var query = client.query("SELECT * FROM usuario  where id ="+usu_id);
        query.on('row', function(row) {
            users.push(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', function() {
            if(users.length == 0){
                done();
                return {'data':'No se encontro id'};
            }
            console.log("Largo de users afuera:" + users.length);
            for (var i = 0; i < users.length;i++) {
                var id = 0;
                var u = 0;
                var q = client.query("select interes.nombre as value,categorias.nombre  as category from interes inner join relacioniu on relacioniu.idinteres=interes.id inner join categorias on categorias.id=interes.categoria where relacioniu.idusuario = '"+users[i].id+"'", function(err, interest) {
                    users[id].interes = interest.rows;
                    id++;
                });
                var ubi = client.query("select ubicaciones.latitud, ubicaciones.longitud from ubicaciones where ubicaciones.usuario = '"+users[i].id+"'", function(err, ubicacion) {
                    users[u].ubicacion = ubicacion.rows[0];
                    u++;
                    if(u == users.length){
                        var rta = {};
                        rta.user = pasarAIngles(users);
                        rta.user = rta.user[0];
                        rta.metadata = {'version':version};                        
                        done();
                        callback(rta);
                    }
                });
            }
            //return res.json(users);
        });

    });
};
//FOTO
app.get('/users/:id/photo',function(req,res){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        // Levanta las excepciones de la conecion
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        var id = req.params.id;
        client.query("Select foto from usuario where id="+id,function(err,result){
            if(result.rows.length == 0){
                return res.status(500).send("No se encontro usuario");
            }else{
                var foto = result.rows[0].foto;
                done();
                return res.status(200).send(foto);
            }
        });
    });
});


//CATEGORIAS

//Obtener categorias
app.get('/categories',function(req,res){
	obtenerCategorias(res,function(success,result){
    	if(!success){
    		return res.status(500);
    	}
        var r = {};
        r.categories = result;
        r.metadata = escribirMetadata(result.length);
        return res.status(200).json(r);
    });
});

//Insertar categoria
app.post('/categories',function(req,res){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        // Levanta las excepciones de la conecion
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        client.query("Insert into categorias(nombre) values($1)",[req.body.category.value],function(err,result){
            done();
            return res.sendStatus(201);
        });
    });
});

//Modificar Categorias
app.put('/categories',function(req,res){
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        client.query("Update categorias set nombre=($1) where id=($2)",[req.body.category.value,req.body.category.id]);
    	done();
    	return res.sendStatus(200);
    });
});

//Eliminar Categoria
app.delete('/categories',function(req,res){
    pg.connect(process.env.DATABASE_URL,function(err,client,done){
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        var intQuery=client.query("Select * from interes where categoria=($1)",[req.body.id]);
        cont=0;
        intQuery.on('row', function(row) {
        	cont++;
        });
        intQuery.on('end', function() {
	        if(cont > 0){
	            done();
	            console.log("Ya lo tenia un interes");
	            return res.status(500).send("Por lo menos un interes tiene la categoria que se quiere eliminar");
            }
            client.query("Delete from categorias where id=($1)",[req.body.id],function(err,result){
            	done();
            	return res.sendStatus(200);
        	});
        });
    });
});

//INTERESES

//Creacion de interes
app.post('/interests', function (req, res, next) {

	//Valido estructura
	if(!validadores.postInteres(req.body)){
		return res.status(500).send("Estructura incorrecta");
	}
    var data = {nombre: req.body.interest.value, categoria: req.body.interest.category};

    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        //Busco el id de la categoria
        var id = 0;
        var consulta = client.query("Select id from categorias where nombre = '"+data.categoria+"'");
        consulta.on('row', function(row) {
            id = row.id;
        });
        consulta.on('end',function(err){
        	if(id == 0){
	          done();
	          return res.status(500).send("Categoria inexistente");
	        }
            client.query("INSERT INTO interes (nombre,categoria) values($1,$2)", [data.nombre,id],function(err,result){
            	console.log("Error: " + err);
                done();
                return res.sendStatus(201);
            });


    });
});
});

//Borrar interes
app.delete('/interests', function(req, res) {
    console.log("requirio eliminar");
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        //Me fijo si algun usuario lo tiene como interes, si es asi, no se puede eliminar
        relaciones = client.query("Select * from relacioniu where idinteres=($1)", [req.body.id]);
        var cont = 0;
        relaciones.on('row',function(row){
            cont++;
        });
        relaciones.on('end',function(){
            if(cont > 0){
                done();
                console.log("Ya lo tenia un user");
                return res.status(500).send("Por lo menos un usuario tiene este interes");
            }
            r = client.query("DELETE FROM interes WHERE id=($1)", [req.body.id]);
            r.on('end',function(){
                done();
                return res.sendStatus(200);
            });
        });
    });
});

//Modifica interes
app.put('/interests',function(req,res){
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        var idCategoria = -1;
        var buscarId = client.query("Select id from categorias where nombre=($1)",[req.body.categoria]);
        buscarId.on('row',function(row){
            idCategoria = row.id;
        });
        buscarId.on('end',function(){
            if(idCategoria == -1){
                done();
                return  res.status(500).send("No se encontro categoria");
            }
            client.query("Update interes set nombre=($1), categoria=($2) where id=($3)",[req.body.interes,idCategoria,req.body.id],function(err){
                done();
                return res.sendStatus(201);
            });
        });
    });
});

//Get de todos los intereses
app.get('/interests', function(req, res) {
    obtenerIntereses(res,function(success,result){
    	if(!success){
    		return res.status(500);
    	}
        var r = {};
        r.interests = result;
        for(var i = 0; i < result.length;i++){
            r.interests[i].id = undefined;
        }
        r.metadata = escribirMetadata(result.length);
        return res.json(r);
    })
});

//USUARIOS

/*Create de usuario*/
app.post('/users', function (req, res, next) {

	//Valido los datos
    if(req.body.user != undefined && req.body.user.age != undefined && req.body.user.location != undefined && req.body.user.location.latitude != undefined && req.body.user.location.longitude){
        req.body.user.age = Number(req.body.user.age);
        req.body.user.location.latitude = Number(req.body.user.location.latitude);
        req.body.user.location.longitude = Number(req.body.user.location.longitude);
    }
	if(!validadores.postUsuario(req.body)){
		return res.status(500).send("Estructura incorrecta");
	}
    console.log("Paso los validadores");
    var data = {nombre: req.body.user.name, alias: req.body.user.alias,
	sexo: req.body.user.sex, edad: req.body.user.age, foto: req.body.user.photo_profile,
	email: req.body.user.email};
    var ubicacion = {latitud: req.body.user.location.latitude, longitud: req.body.user.location.longitude};
    var intereses = [];
    for(var i = 0;i < req.body.user.interests.length;i++){
        intereses.push(req.body.user.interests[i]);
    }
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        var query = client.query("INSERT INTO usuario	(nombre,alias,sexo,foto,email,edad) values($1,$2,$3,$4,$5,$6)", [data.nombre, data.alias,data.sexo,data.foto,data.email,data.edad]);
        query.on('end', function() {
            var id = -1;
            var id_search = client.query("select max(id) from usuario");
            id_search.on('row', function(row) {
                id =row.max;
            });
            id_search.on('end',function(){
                if(id == -1){
                    done();
                    return res.status(500).send("No se pudo agregar");
                }
                client.query("Insert into ubicaciones(usuario,longitud,latitud) values ("+id+","+ubicacion.longitud+","+ubicacion.latitud+")");
                var i = 0;
                var fallo = false;
                var aux = 0;
                var cont = 0;
                for ( i = 0; i < intereses.length; i ++) {
                    client.query("Select interes.id from interes inner join categorias on categorias.id=interes.categoria where categorias.nombre='"+intereses[i].category+"' and interes.nombre='"+intereses[i].value+"'",function(err, result){
                        if(result.rows.length == 0){
                            done();
                            client.query("delete from relacioniu where idusuario="+id);
                            client.query("delete from usuario where id="+id);
                            if(cont == 0){
                                cont++;
                                return res.status(500).send("No existen los interes");
                            }
                        }else{
                            if(cont == 0){  
                                var r = client.query("insert into relacioniu values("+id+","+result.rows[0].id+")")
                                r.on('end',function(){
                                    aux++;
                                    if( aux == intereses.length){
                                        done();
                                        buscarPorId(id,function(result){
                                            console.log(result);
                                            return res.status(201).json(result);
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                if(intereses.length == 0){
                    console.log("Sin intereses");
                    done();
                    buscarPorId(id,function(result){
                        return res.status(201).json(result);
                    });
                }
            });
        }
	);


    });
});

//GET  de todos los usuarios
app.get('/users', function(req, res) {
    obtenerUsuarios(res,function(success,result){
    	if(!success){
    		return res.status(500);
    	}
        var rta = {};
        var i = 0;
        for(;i < result.length;i++){
           result[i].photo_profile = "http://tander.herokuapp.com/users/"+result[i].id+"/photo";
        }
        rta.metadata = escribirMetadata(result.length);
        rta.users = result;
        return res.status(200).json(rta);
    });
}); 


//GET de un usuario por id
app.get('/users/:usu_id', function(req, res) {
    buscarPorId(req.params.usu_id,function(result){
            return res.json(result);
    });
}); 

// Modifica usuario
app.put('/users/:usu_id', function(req, res) {

	//validar estructura
	if(!validadores.putUsuario(req.body)){
		return res.status(500).send("Estructura incorrecta");
	}
    console.log("PUT:Valide la estructura");
    var results = [];
    var id = req.params.usu_id;
    var data = {nombre: req.body.user.name, alias: req.body.user.alias,
	sexo: req.body.user.sex, foto: req.body.user.photo_profile,
	email: req.body.user.email, edad: req.body.user.age};
    var ubicacion = req.body.user.location;
    var intereses = [];
    for(var i = 0;i < req.body.user.interests.length;i++){
        intereses.push(req.body.user.interests[i]);
    }
    console.log("PUT:Guarde los campos");
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }
        console.log("PUT: Accedi a la base de datos")
        var query = client.query("UPDATE usuario SET nombre=($1), alias=($2), sexo=($3), foto=($4), email=($5), edad=($6) WHERE id=($7)", [data.nombre, data.alias,data.sexo,data.foto,data.email,data.edad,id]);
        query.on('end', function() {
            var q = client.query('Update ubicaciones set latitud='+ubicacion.latitude+', longitud='+ubicacion.longitude+' where usuario='+id);
            q.on('end',function(){
                d = client.query('delete from relacioniu where idusuario='+id);
                d.on('end',function(){
                var aux = 0;
                var cont = 0;
                for (var i = 0; i < intereses.length; i ++) {
                    client.query("Select interes.id from interes inner join categorias on categorias.id=interes.categoria where categorias.nombre='"+intereses[i].category+"' and interes.nombre='"+intereses[i].value+"'",function(err, result){
                            if(cont == 0 && result.rows.length == 0){
                                cont++
                                console.log("No xiste interes");
                                return res.status(500).send("No existe algun interes");
                            }
                            var final = client.query("insert into relacioniu values("+id+","+result.rows[0].id+")");
                            final.on('end',function(){
                                if(cont == 0 && aux == intereses.length -1){
                                    done();
                                    buscarPorId(id,function(result){
                                        return res.status(201).json(result);
                                    });
                                }
                                aux++
                            });
                        });
                    }
                    if(intereses.length == 0){
                        done();
                        buscarPorId(id,function(result){
                            return res.status(201).json(result);
                        });
                    }
                });
            });
        });
    });

});

// Modifica foto de perfil
app.put('/users/:usu_id/photo', function(req, res) {
     
    //Valido esquema
    if(!validadores.putFoto(req.body)){
		return res.status(500).send("Estructura incorrecta");
	}
    var id =  req.params.usu_id;
    var foto = req.body.photo;

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(err);
        }

        var r = client.query("UPDATE usuario SET foto=($1) WHERE id=($2)", [foto,id]);
        r.on('end',function(){
            done();
            return res.sendStatus(200);
        });
    });

});

//borra usuario
app.delete('/users/:usu_id', function(req, res) {

    var results = [];
    var id = req.params.usu_id;
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done()
          console.log(err);
          return res.status(500).send(err);
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM usuario WHERE id=($1)", [id]);
        client.query("delete from ubicaciones where usuario=($1)",[id]);
        var r = client.query("delete from relacioniu where idusuario=($1)",[id]);
        r.on('end',function(){
            done();
            return res.sendStatus(200);
        });
    });

});




