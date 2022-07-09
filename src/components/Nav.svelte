<script lang="ts">
  import Icon from '@iconify/svelte';

  export let segment: string;
</script>

<nav
  class="flex items-center justify-between flex-wrap p-4"
  style="background-color: #1E2021"
>
  <div class="flex items-center flex-shrink-0 mr-4">
    <a aria-current={segment === undefined ? 'page' : undefined} href=".">
      <Icon
        icon="emojione:dog-face"
        inline="true"
        style="font-size: 32px; margin-right: 8px"
      />
    </a>
    <span class="font-semibold text-xl tracking-tight text-ameprimary">
      <a aria-current={segment === undefined ? 'page' : undefined} href=".">
        supp4bubb4
      </a>
    </span>
  </div>
</nav>
