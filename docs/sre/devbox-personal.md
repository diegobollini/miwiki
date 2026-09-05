# Devbox Personal

Devcontainer para trabajar en proyectos personales desde cualquiera de mis notebooks —incluida la laboral— sin mezclar identidades ni credenciales con el entorno de trabajo.

- [Repositorio](https://github.com/diegobollini/devbox-personal)

## Qué aísla

Aísla **identidad y tooling**, no el código frente al empleador (en la notebook laboral los archivos siguen viviendo en su disco — es una decisión, no un descuido):

| Superficie | Cómo |
|---|---|
| Claves SSH | Volumen `personal-ssh`, clave propia del container. Se corta el ssh-agent forwarding del host (`SSH_AUTH_SOCK: ""`), si no las claves del host serían usables adentro. |
| Auth de GitHub (`gh`) | Volumen `personal-gh`, sin bind a `~/.config/gh` del host. |
| Auth de Claude Code | Volumen `personal-claude`. |
| Identidad de git | `identity.env` + `assert-identity.sh` en cada arranque — necesario porque Dev Containers copia el `~/.gitconfig` del host e inyecta su credential helper. |
| Código | Un solo bind: `~/personal` del host. |
| Contexto de IA | `AGENTS.md` en la raíz del workspace, heredado por todos los proyectos. Sin MCPs corporativos. |

## Setup (una vez por máquina)

```bash
mkdir -p ~/personal
git clone git@github.com:diegobollini/devbox-personal.git ~/personal/devbox-personal
```

El clone tiene que quedar exactamente en `~/personal/devbox-personal`: el `workspaceMount` monta el padre `~/personal` y los hooks resuelven por ese nombre.

1. Editar `.devcontainer/identity.env` con el email personal — si queda el placeholder, el container **falla al arrancar** a propósito (mejor eso que commitear en silencio con la identidad de Adhoc).
2. Abrir `~/personal/devbox-personal` en VS Code → *Reopen in Container*, desde una ventana del host (no desde adentro de otro devcontainer).
3. Seguir los tres pendientes que imprime el post-create: cargar la clave pública en GitHub, `gh auth login`, `claude /login`.

La clave SSH se carga **dos veces** en [github.com/settings/keys](https://github.com/settings/keys): como *Authentication Key* y como *Signing Key*. Sin la segunda, los commits se firman igual pero GitHub los muestra "Unverified".

## Verificar que no se coló nada del host

```bash
bash devbox-personal/.devcontainer/check-isolation.sh
```

Chequea el ssh-agent del host, la identidad de git, la cuenta de `gh`, que no haya MCPs corporativos registrados y la firma de commits. Sale 1 si algo falla.

## Sincronizar entre notebooks

- **Definición del container**: este repo — `git pull` y rebuild.
- **Auth**: se hace una vez por máquina, vive en los volúmenes y sobrevive rebuilds.
- **Clave SSH**: una por máquina, dos entradas en GitHub. Revocar una no deja afuera a la otra.
- **Estado sin commitear**: no se sincroniza — si hace falta, faltó un commit.

## Dotfiles

`post-create.sh` tiene una variable `DOTFILES_REPO` (vacía por default); con una URL, clona el repo en `~/.dotfiles` y corre su `install.sh`. Se hace así y no con la setting `dotfiles.repository` de VS Code a propósito: esa es una setting de usuario del host y se aplicaría también a los containers corporativos, inyectando los dotfiles personales ahí.

## Extender

Herramientas nuevas van al `post-create.sh`. Runtimes y Docker-in-Docker como *features* en `devcontainer.json`:

```jsonc
"features": {
  "ghcr.io/devcontainers/features/docker-in-docker:2": { "moby": false }
}
```

`moby: false` porque los paquetes de moby no existen para Debian Trixie.
