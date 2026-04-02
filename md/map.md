# map:
Créait une `iframe` vers [open street map](https://www.openstreetmap.org/#map=6/46.449/2.210) pour afficher une carte et un pointeur GPS si besoin.

## minimum:
```javascript
{
	type:"map",
	view:{
		a:0.627924,
		b:48.176467,
		c:0.630799,
		d:48.174582
	}
}
```

## options supplémentaires:
```javascript
{
	id:"element id",
	style:"/* std css */",
	title:"description visible au survol de la sourie",
	gps:[
		{
			a:48.175495,
			b:0.628918
		}
	]
}
```
