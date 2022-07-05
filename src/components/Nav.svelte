<script lang="ts">
  export let segment: string;
</script>

<nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
  <div class="flex items-center flex-shrink-0 text-white mr-6">
    <span class="font-semibold text-xl tracking-tight">
      <a aria-current={segment === undefined ? "page" : undefined} href=".">
        supp4bubb4
      </a>
    </span>
  </div>
  <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
    <div class="text-sm lg:flex-grow">
      <a
        aria-current={segment === "about" ? "page" : undefined}
        href="about"
        class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
      >
        about
      </a>
    </div>
  </div>
</nav>
