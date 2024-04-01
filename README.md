# Wiki personal / Jardín digital / Laboratorio

## Links

- [Jekyll RB](https://jekyllrb.com/)
- [Just The Docs](https://just-the-docs.com/)

## Intro

Puede no ser el abordaje más práctico pero me pareció un proyecto curioso para implementar. Se trata básicamente de una página usando Jekyll, una gema de ruby, que convierte archivos de texto (markdown) en websites estáticos y blogs.

## Jekyll - Local

Este es el camino largo, que permite servir el sitio localmente. Así se pueden ver los cambios, páginas agregadas, etc. sin la necesidad de construir el sitio en Github Pages. Es práctico para empezar y entender la dinámica y luego se puede limpiar la instalación.

Instalar ruby y dependencias:

```bash
$ sudo apt-get install ruby-full build-essential
# Agregar en:
$ code ~/.zshrc
# Install Ruby Gems to ~/gems
export GEM_HOME="$HOME/gems"
export PATH="$HOME/gems/bin:$PATH"
$ source ~/.zshrc
```

Instalar jekyll, bundler y demás gemas:

```bash
$ gem install jekyll bundler
$ ruby -v
ruby 3.1.2p20 (2022-04-12 revision 4491bb740a) [x86_64-linux-gnu]
$ gem -v
3.3.15
$ bundler -v
Bundler version 2.5.7
$ jekyll -v
jekyll 4.3.3
```

```bash
# Instalar gemas necesarias (ver Gemfile)
$ bundle install
# Eliminar gemas:
$ bundle clean --force
```

### Just The Docs

_"A modern, highly customizable, and responsive Jekyll theme for documentation with built-in search. Easily hosted on GitHub Pages with few dependencies"_.

```ruby
# Agregar en Gemfile:
gem "just-the-docs"
```

```yml
# Agregar en _config.yml:
theme: just-the-docs
```

### Serve

Una vez que está todo instalado (además de haber agregado los docs .md) podemos levantar localmente el sitio:

```bash
$ bundle exec jekyll serve
Configuration file: /home/diego/proyectos/miwiki/_config.yml
            Source: /home/diego/proyectos/miwiki
       Destination: /home/diego/proyectos/miwiki/_site
 Auto-regeneration: enabled for '/home/diego/proyectos/miwiki'
    Server address: http://127.0.0.1:4000
```

![image](/assets/images/wiki_front.png)

## Jekyll - GitHub Pages

Agregar en .github `dependabot.yml` y en .github/workflows `ci.yml` y `pages.yml`. Esto es independiente de la instalación local, es decir se puede deployar el sitio sin instalar jekyll y gems.  
Cuando se haga algún commit se disparan las acciones que construyen el artefacto y lo deployan en Pages.

#### Jekyll Youtube

Este [plugin](https://github.com/dommmel/jekyll-youtube) de Jekyll agrega una etiqueta markdown que toma una URL de Youtube y genera el fragmento HTML (responsive) correspondiente para visualizar el video en la página. Es decir, permite agregar videos con algo tan simple como `{% youtube "https://youtu.be/m04hKq9DETw" %}`.

Para usarlo, agregar al Gemfile y al config:

```ruby
group :jekyll_plugins do
    gem "jekyll-youtube"
end
```

```yml
plugins: [jekyll-youtube]
```
