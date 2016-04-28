import requests;
import json;
import unittest

intereses = [{'value':'Argentina', 'category':'outdoors'},{'value':'La Vela','category':'music/band'}]
ubicacion = {'latitude':3.14, 'longitude':78.956}
user = {'name':'TestIntegracion','interests':intereses,'age':20,'location':ubicacion,'alias':'Palo','sex':'M','photo_profile':'unaFoto','email':'unamail'}
headers = {'content-type': 'application/json'}
metadata = {'version':0.5}
interes = {'interest':{'value':'Asado','category':'food'}}
r = {}
r['user'] = user
r['metadata'] = metadata


class TestUM(unittest.TestCase):

    def test_1_a_get_intereses_cero_cuenta_cero(self):
    	self.assertEqual(requests.get('http://127.0.0.1:3000/api/v1/tander/interests').json()['metadata']['count'],0)
 
 	def test_1_b_get_intereses_cero_no_hay_intereses(self):
 		self.assertEqual(requests.get('http://127.0.0.1:3000/api/v1/tander/interests').json()['interests'],[])

    def test_2_alta_interes(self):
    	r = requests.post('http://127.0.0.1:3000/api/v1/tander/interests',data=json.dumps(interes), headers=headers)
        self.assertEqual(r.status_code,201)

    def test_3_Se_Ingreso_Interes_categoria(self):
    	r = requests.get('http://127.0.0.1:3000/api/v1/tander/interests');
    	self.assertEqual(r.json()['interests'][0]['category'],'food')
    
	def test_4_Se_Ingreso_Interes_valor(self):
    	r = requests.get('http://127.0.0.1:3000/api/v1/tander/interests');
    	self.assertEqual(r.json()['interests'][0]['value'],'Asado')


requests.delete('http://127.0.0.1:3000/api/v1/tander/borrar/borrarBase')
unittest.main()
r = requests.get('http://127.0.0.1:3000/api/v1/tander/interests');
print(r.json().interests)