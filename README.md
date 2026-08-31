# Wiki personal / Jardín digital / Laboratorio

## Links

- [MkDocs](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## Intro

Página estática generada con [MkDocs](https://www.mkdocs.org/) y el tema [Material](https://squidfunk.github.io/mkdocs-material/), a partir de archivos markdown. El deploy lo hace [Cloudflare Pages](https://pages.cloudflare.com/): cada push a `main` dispara un build y publicación automáticos, sin workflows de GitHub Actions que mantener.

_Nota: el sitio corrió antes en Jekyll + GitHub Pages. Se migró a este stack para simplificar el deploy (ver historial de commits)._

## Local

Instalar dependencias (requiere Python 3):

```bash
$ python3 -m venv .venv
$ source .venv/bin/activate
$ pip install -r requirements.txt
```

Levantar el sitio en local, con recarga automática al guardar cambios:

```bash
$ mkdocs serve
# http://127.0.0.1:8000
```

Buildear el sitio estático (queda en `./site`, no se versiona):

```bash
$ mkdocs build
```

## Contenido

Cada sección vive en una carpeta bajo `docs/` (`artes/`, `linux/`, `sre/`, etc.), con su propio `index.md`. El menú de navegación se define a mano en [`mkdocs.yml`](./mkdocs.yml) — para agregar una página nueva: crear el archivo `.md` en la carpeta correspondiente y sumar la entrada en el `nav` de `mkdocs.yml`.

## Deploy

El deploy corre en [Cloudflare Pages](https://pages.cloudflare.com/), conectado directamente al repositorio de GitHub (proyecto configurado desde el dashboard de Cloudflare, no desde este repo):

- **Build command**: `pip install -r requirements.txt && mkdocs build`
- **Build output directory**: `site`
- **Rama de producción**: `main`

Cada push a `main` buildea y publica solo; cada Pull Request genera un preview aparte. El dominio propio (`wiki.bolli.ar`) se configura como Custom Domain del proyecto en el dashboard de Cloudflare Pages, apuntando el DNS del dominio a Cloudflare.
