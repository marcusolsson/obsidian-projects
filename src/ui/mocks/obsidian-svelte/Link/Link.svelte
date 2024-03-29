<script>
  export let href;
  const externalPattern = /^[a-zA-Z]+\:\/\//;
  const aria = {
    "aria-label": href,
    "aria-label-position": "top",
  };
</script>

<a
  {href}
  class:external-link={externalPattern.test(href)}
  rel="noopener"
  target="_blank"
  {...aria}
>
  <slot />
</a>
