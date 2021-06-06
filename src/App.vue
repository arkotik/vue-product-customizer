<template>
  <div class="layout">
    <header/>
    <section class="content">
      <Editor :templates="templates"/>
    </section>
  </div>
</template>

<script>

import Editor from '@/components/editor/Editor';

function getTplUrl(product, file) {
  return `/templates/${product}/${file}`;
}

export default {
  name: 'App',
  components: { Editor },
  computed: {
    templates() {
      return [
        {
          id: 'front',
          title: 'Front side',
          image: getTplUrl('t-shirt', 'front.png'),
          thumb: getTplUrl('t-shirt', 'front.thumb.png'),
          default: true,
        },
        {
          id: 'back',
          title: 'Back side',
          image: getTplUrl('t-shirt', 'back.png'),
          thumb: getTplUrl('t-shirt', 'back.thumb.png'),
        },
      ];
    }
  }
};
</script>
