<template>
  <div class="layout">
    <header/>
    <section class="content">
      <Editor/>
    </section>
  </div>
</template>

<script>

import Editor from '@/components/editor/Editor';

export default {
  name: 'App',
  components: { Editor },
};
</script>
