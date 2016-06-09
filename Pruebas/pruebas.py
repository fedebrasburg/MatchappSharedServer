
import unittest
import requests
import json

dir = 'http://localhost:5000'
 
class TestUM(unittest.TestCase):
 
    def setUp(self):
        pass
 

    def test_post_usuario_simple(self):
    	ubicacion = {'latitude':-34.610510, 'longitude':-58.386391}
        foto = "data:image/jpg;base64,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"
        intereses = [{'value':'La vela', 'category':'Musica'},{'value':'La vela', 'category':'Musica'}]
        user = {'name':'Test234','interests':intereses,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
        headers = {'content-type': 'application/json'}
        metadata = {'version':"0.567","count":1}
        r = {}
        r['user'] = user
        r['metadata'] = metadata
    	a = requests.post(dir+'/users',data=json.dumps(r), headers=headers)
    	self.assertEqual(a.status_code,201)
    	rta = a.json()
    	id = rta["user"]["id"]
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    	rta = requests.get(dir+'/users/'+str(id), headers=headers).json()
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    def test_post_usuario_sin_foto_ni_intereses(self):
    	ubicacion = {'latitude':-34.610510, 'longitude':-58.386391}
    	foto = ""
    	intereses = []
    	user = {'name':'Test234','interests':intereses,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata
    	a = requests.post(dir+'/users',data=json.dumps(r), headers=headers)
    	self.assertEqual(a.status_code,201)
    	rta = a.json()
    	id = rta["user"]["id"]
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    	rta = requests.get(dir+'/users/'+str(id), headers=headers).json()
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    def test_put_usuario_edad(self):
    	ubicacion = {'latitude':-34.610510, 'longitude':-58.386391}
    	foto = ""
    	intereses = []
    	user = {'name':'Test234','interests':intereses,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata
    	a = requests.post(dir+'/users',data=json.dumps(r), headers=headers)
    	self.assertEqual(a.status_code,201)
    	rta = a.json()
    	id = rta["user"]["id"]
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    	foto = ""
    	intereses = []
    	user = {'name':'Test234','interests':intereses,'id':id,'location':ubicacion,'alias':'Robert','age':54,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata

    	rta = requests.put(dir+'/users/'+str(id),data=json.dumps(r) ,headers=headers).json()
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    def test_put_usuario_mail(self):
    	ubicacion = {'latitude':-34.610510, 'longitude':-58.386391}
    	foto = ""
    	intereses = []
    	user = {'name':'Test234','interests':intereses,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata
    	a = requests.post(dir+'/users',data=json.dumps(r), headers=headers)
    	self.assertEqual(a.status_code,201)
    	rta = a.json()
    	id = rta["user"]["id"]
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    	foto = ""
    	intereses = []
    	user = {'name':'Test234','interests':intereses,'id':id,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'maildecambio@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata

    	rta = requests.put(dir+'/users/'+str(id),data=json.dumps(r) ,headers=headers).json()
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    def test_put_usuario_intereses(self):
    	ubicacion = {'latitude':-34.610510, 'longitude':-58.386391}
    	foto = "foto1"
    	intereses = []
    	user = {'name':'Test234','interests':intereses,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata
    	a = requests.post(dir+'/users',data=json.dumps(r), headers=headers)
    	self.assertEqual(a.status_code,201)
    	rta = a.json()
    	id = rta["user"]["id"]
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    	foto = "foto1"
    	intereses = [{'value':'La vela', 'category':'Musica'},{'value':'La vela', 'category':'Musica'}]
    	user = {'name':'Test234','interests':intereses,'id':id,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata

    	rta = requests.put(dir+'/users/'+str(id),data=json.dumps(r) ,headers=headers).json()
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    def test_put_usuario_fotos(self):
    	ubicacion = {'latitude':-34.610510, 'longitude':-58.386391}
    	foto = "foto1"
    	intereses = [{'value':'La vela', 'category':'Musica'},{'value':'La vela', 'category':'Musica'}]
    	user = {'name':'Test234','interests':intereses,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata
    	a = requests.post(dir+'/users',data=json.dumps(r), headers=headers)
    	self.assertEqual(a.status_code,201)
    	rta = a.json()
    	id = rta["user"]["id"]
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])

    	foto = "foto19999"
    	intereses = [{'value':'La vela', 'category':'Musica'},{'value':'La vela', 'category':'Musica'}]
    	user = {'name':'Test234','interests':intereses,'id':id,'location':ubicacion,'alias':'Robert','age':45,'sex':'H','photo_profile':foto,'email':'roberto.gonzales@gmail.com'}
    	headers = {'content-type': 'application/json'}
    	metadata = {'version':"0.567","count":1}
    	r = {}
    	r['user'] = user
    	r['metadata'] = metadata

    	rta = requests.put(dir+'/users/'+str(id),data=json.dumps(r) ,headers=headers).json()
    	self.assertEqual(rta["user"]["age"], r["user"]["age"])
    	self.assertEqual(rta["user"]["location"], r["user"]["location"])
    	self.assertEqual(rta["user"]["name"], r["user"]["name"])
    	self.assertEqual(rta["user"]["sex"], r["user"]["sex"])
    	self.assertEqual(rta["user"]["photo_profile"], r["user"]["photo_profile"])
    	self.assertEqual(rta["user"]["email"], r["user"]["email"])
    	self.assertEqual(rta["user"]["interests"], r["user"]["interests"])












 
    
 
if __name__ == '__main__':
    unittest.main()