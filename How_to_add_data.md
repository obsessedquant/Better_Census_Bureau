

add layer to class map



1) find the data that needs to be on the map. Select from the pdf file describing the data

E_AGE65

E_AGE17

E_DISABL

E_SNGPNT

2. Add a layer declaration 

   1. find convert data from string to number in census_map.js
   2. Create new variable as necessary 

3. Go to layer definition and create your layer

   Var house_comp = new l.layergroup():

   copy a geojson definition and add your variables. This is the new choropleth for your data

4. add a legend

   1. create a new legend variable 
   2. create a new .onadd section 

5. add an overlay 

   1. go to overlayMaps
   2. add your overlay use the variable crated previously

6. Add a legend

7. Under 17, over 65, has disability, or single parent



config web server

```
# 1. create a new clean env
# python -m venv <name>
# 2. add this name to gitignore
# 3. use git bash > source <name>/Scripts/activate
# 4. conda deactivate
# 5. pip freeze > make sure it's clean
# 6. pip install dependencies > make sure you will have gunicorn
# 7. make sure you create a db on heroku > make sure 'posgresql'
# go to heroku website > go to app > Setting > create a new key for your correct DB link
# 8. put this new var to your code
# 9. python app.py on localhost
```

