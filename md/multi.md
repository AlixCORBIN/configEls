# multi :

Cet élément se comporte de façon similaire a l'élément [bin](bin.md).

Créait un texte qui sera colorisé en fonction de la donnée sur le *channel* ainsi que du couple seuil/couleur passé en paramètres. Si le texte n'est pas défini, la donnée sera affichée.

## minimum:
```javascript
{
	type:"bin",
	channel:"WEBSOCKET CHANNEL",
	color:[ "green", 1 , "blue", 2.5 ]
}
```

- `color` est un tableau contenant des [couleurs](color.md) et des valeurs :

Le tableau de couleur précednet donne ce rendu :
```
value  <= 1 : color == green
1 < value  <= 2.5 : color == "blue"
2.5 > couleur par defaut
```

## options supplémentaires:

```javascript
{
	...
	text:"texte affiché",
	periode:0,
}
```
- `text` texte qui sera affiché,
- `periode` est le type d'actualisation, la gestion de ce paramètre est dépendante du serveur,


## Note :
Attention, le texte n'est pas directement colorisé selon les seuils définis, c'est une variable qui est mise à jour. Il faut donc affecter cette variable au texte ou à un autre élément.

Pour exemple le CSS pourrait ressembler à ceci :

pour changer la couleur du texte
```CSS
.items.status {
  color: var(--status-color);
}
```

ou encore pour afficher un point devant le texte qui lui seul changera de couleur, effet led.
```CSS
.items.status::before {
  color: var(--status-color);
  content: "●";
  font-size: 1em;
}
```