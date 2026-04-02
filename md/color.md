# colors :

Le couleurs sont definissale de plusieurs manière possible :

- label de couleur standard tels que `green` / `red` / ...,
- `#f00` le code couleur court ( rouge ),
- `#ff0000` le code couleur long ( rouge ),
- `rgb( 255, 0, 0 )` le *rgb* de la couleur ( rouge ),
- `rgba( 255, 0, 0, 0.8 )` le *rgba* de la couleur ( rouge ),
- `--color-var` une variable CSS définie dans la page de l'IHM,

```CSS
:root {
	--color-var: rgb( 128, 128, 128 );
}
```