# button:

Élément qui génère un bouton qui peut au choix, envoyer une commande, ou émettre un événement global pour la page.

```javascript
{
	type: "button",
	options:[
		{
			label: "X", // text avant le bouton
			text: "Y", // text dans le bouton
			cmd: "myCmd", // la commande renvoyé au serveur
			event: undefined, // l'event qui sera emis sur la globalité de la page
		}
	]
}
```

si `cmd` n'est pas défini seul l'événement de page sera fonctionnel et inversement.