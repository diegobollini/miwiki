document$.subscribe(() => {
  if (typeof twttr !== "undefined" && twttr.widgets) {
    twttr.widgets.load()
  }
})
