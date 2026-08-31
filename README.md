# Wiki personal / Jardín digital / Laboratorio

## Links

- [MkDocs](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

## Intro

Página estática generada con [MkDocs](https://www.mkdocs.org/) y el tema [Material](https://squidfunk.github.io/mkdocs-material/), a partir de archivos markdown. El deploy lo hace un [Cloudflare Worker de assets estáticos](https://developers.cloudflare.com/workers/static-assets/), conectado directamente al repo de GitHub: cada push a `main` dispara un build y publicación automáticos, sin workflows de GitHub Actions que mantener.

_Nota: el sitio corrió antes en Jekyll + GitHub Pages. Se migró a este stack para simplificar el deploy (ver historial de commits). GitHub Pages quedó desactivado en la configuración del repo._

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

El proyecto en Cloudflare (**Workers & Pages → miwiki**) está conectado por GitHub App al repo `diegobollini/miwiki`. Build y deploy corren ahí, no en este repo:

- **Build command** (configurado en el dashboard, Settings → Build): `pip install -r requirements.txt && mkdocs build`
- **Deploy command**: `npx wrangler deploy` — usa [`wrangler.toml`](./wrangler.toml), que apunta los assets estáticos a `./site` (la salida de `mkdocs build`)
- **Rama de producción**: `main`

Cada push a `main` buildea y publica solo. El dominio propio (`wiki.bolli.ar`) se agrega como Custom Domain en la pestaña **Domains** del proyecto — como `bolli.ar` ya vive en la misma cuenta de Cloudflare, queda resuelto sin tocar DNS a mano.

Si en algún momento el deploy automático deja de dispararse con un push, lo primero para chequear es que la GitHub App "Cloudflare Workers & Pages" siga teniendo acceso al repo en [github.com/settings/installations](https://github.com/settings/installations) — si el repo no está en la lista de repos permitidos, los pushes no le llegan a Cloudflare.
