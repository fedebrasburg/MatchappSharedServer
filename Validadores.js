var Validator = require('jsonschema').Validator;  
    var LocationSchema = {
    	"id": "/Location",
	  	"type":"object",
	  	"properties":{
	  		"latitude":{"type":"number"},
	  		"longitude":{"type":"number"}
	  	},
	  	"required": ["latitude","longitude"]
    };

    var InterestSchema = {
    	"id": "/Interest",
	  	"type":"object",
	  	"properties":{
	  		"category":{"type":"string"},
	  		"value":{"type":"string"}
	  	},
	  	"required": ["category","value"]
    };

	var userSchema = {
	  	"id": "/User",
	  	"type":"object",
	  	"properties":{
	  		"name":{"type":"string"},
	  		"alias":{"type":"string"},
	  		"age":{"type":"integer"},
	  		"sex":{"type":"string"},
	  		"email":{"type":"string"},
	  		"location":{"$ref":"/Location"},
	  		"photo_profile":{"type":"string"},
	  		"interests":{
	  			"type":"array",
	  			"items":{"$ref":"/Interest"}
	  		}
	  	},
	  	"required":["name","alias","sex","age","email","location","interests","photo_profile"]
	};

	var userSchemaWithId = {
	  	"id": "/UserWithId",
	  	"type":"object",
	  	"properties":{
	  		"name":{"type":"string"},
	  		"alias":{"type":"string"},
	  		"age":{"type":"integer"},
	  		"sex":{"type":"string"},
	  		"email":{"type":"string"},
	  		"location":{"$ref":"/Location"},
	  		"photo_profile":{"type":"string"},
	  		"id":{"type":"integer"},
	  		"interests":{
	  			"type":"array",
	  			"items":{"$ref":"/Interest"}
	  		}
	  	},
	  	"required":["name","alias","sex","age","email","location","interests","photo_profile","id"]
	};

	var metadataSchema = {
	  	"id":"/Metadata",
	  	"type":"object",
	  	"properties": {
	  		"version": {"type":"string"}
	  	},
	  	"required": ["version"]
	};

	var metadataWithCountSchema = {
	  	"id":"/metadataWithCount",
	  	"type":"object",
	  	"properties": {
	  		"version": {"type":"string"},
	  		"count":{"type":"integer"}
	  	},
	  	"required": ["version"]
	};

	var schema = {
	  	"id": "/General",
	  	"type": "object",
	  	"properties":{
	  		"user":{"$ref":"/User"},
	  		"metadata":{"$ref":"/Metadata"}
	  	},
	  	"required": ["user","metadata"]
	};


this.postUsuario=function(r) {
    var v = new Validator();
	var schema = {
	  	"id": "/General",
	  	"type": "object",
	  	"properties":{
	  		"user":{"$ref":"/User"},
	  		"metadata":{"$ref":"/Metadata"}
	  	},
	  	"required": ["user","metadata"]
	};
    v.addSchema(InterestSchema, '/Interest');
    v.addSchema(LocationSchema, '/Location');
    v.addSchema(userSchema, '/User');
    v.addSchema(metadataSchema, '/Metadata');
    resultado = v.validate(r, schema);
    if (resultado.errors.length == 0) {
    	return true;
    };
    console.log(resultado.errors);
    return false;
}

this.putUsuario=function(r) {
    var v = new Validator();
	var schema = {
	  	"id": "/General",
	  	"type": "object",
	  	"properties":{
	  		"user":{"$ref":"/UserWithId"},
	  		"metadata":{"$ref":"/Metadata"}
	  	},
	  	"required": ["user","metadata"]
	};
    v.addSchema(InterestSchema, '/Interest');
    v.addSchema(LocationSchema, '/Location');
    v.addSchema(userSchemaWithId, '/UserWithId');
    v.addSchema(metadataSchema, '/Metadata');
    resultado = v.validate(r, schema);
    if (resultado.errors.length == 0) {
    	return true;
    };
    return false;
}

this.postInteres=function(r) {
    var v = new Validator();
	var schema = {
	  	"id": "/General",
	  	"type": "object",
	  	"properties":{
	  		"interest":{"$ref":"/Interest"},
	  		"metadata":{"$ref":"/metadataWithCount"}
	  	},
	  	"required": ["interest","metadata"]
	};
    v.addSchema(InterestSchema, '/Interest');
    v.addSchema(metadataSchema, '/metadataWithCount');
    resultado = v.validate(r, schema);
    if (resultado.errors.length == 0) {
    	return true;
    };
    return false;
}

this.putFoto=function(r) {
    var v = new Validator();
	var schema = {
	  	"id": "/General",
	  	"type": "object",
	  	"properties":{
	  		"photo":{"type":"string"},
	  		"metadata":{"$ref":"/metadata"}
	  	},
	  	"required": ["photo","metadata"]
	};
    v.addSchema(InterestSchema, '/Interest');
    v.addSchema(metadataSchema, '/metadata');
    resultado = v.validate(r, schema);
    if (resultado.errors.length == 0) {
    	return true;
    };
    return false;
}