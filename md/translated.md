# traduction:

Utilisé avec la [lib](https://fhgitlab.lan.faureherman.com/submodules/javascript/langandcountry) de gestion des langues, permet de créer un texte dont la traduction changera automatiquement en fonction de la langue demandée.

Dans certains cas il est nécessaire de gérer des traductions, c'est possible en utilisant (sur certains éléments).

```javascript
{
	text_id:"",
	prefix: "",
}
```

## <a id="text"/>text_id:

Création d'un simple texte,

```javascript
{
	type:"text_id",
	text_id:"id du text",
	prefix:"prefix"
}
```

## <a id="title"/>title_id:

Création d'un titre. C'est un titre niveau *h3*.

```javascript
{
	type:"title_id",
	text_id:"id du titre",
	prefix:"prefix"
}
```
