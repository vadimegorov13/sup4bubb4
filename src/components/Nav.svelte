<script lang="ts">
  export let segment: string;
</script>

<nav
  class="flex items-center justify-between flex-wrap p-4"
  style="background-color: #1E2021"
>
  <div class="flex items-center flex-shrink-0 mr-4">
    <span class="font-semibold text-xl tracking-tight text-ameprimary">
      <a aria-current={segment === undefined ? 'page' : undefined} href=".">
        supp4bubb4
      </a>
    </span>
  </div>
</nav>
