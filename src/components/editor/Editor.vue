<template>
    <div class="editor">
        <div class="canvas-handler">
            <v-stage :config="editorConfig">
                <v-layer ref="backLayer">
                    <v-image :config="tplImage" />
                </v-layer>
                <v-layer ref="stuffLayer">
                    <template v-for="(item, i) of shapes">
                        <v-image v-if="item.shape === 'image'" :config="item.config" :key="i" @mousedown="onShapeMouseDown" />
                    </template>
                    <v-transformer ref="transformer" :config="transformerConfig"/>
                </v-layer>
            </v-stage>
        </div>
        <div class="control-panel">
            <button @click="addImage">Add image</button>
            <input type="file" accept="image/*" hidden ref="fileInput">
        </div>
    </div>
</template>

<script>
const snaps = Array(4)
  .fill([0, 30, 45, 60, 90])
  .reduce((acc, cur, i) => [...acc, ...cur.map(el => el + (i * 90))], []);

export default {
  name: 'Editor',
  methods: {
    addImage() {
      this.$refs.fileInput.click();
    },
    setTransformer(node) {
      this.transformer.setNodes([node]);
      this.stuffLayer.batchDraw();
      this.transformer.zIndex(this.stuffLayer.children.length - 1);
    },
    onShapeMouseDown(e) {
      this.setTransformer(e.target);
    },
  },
  computed: {
    transformer() {
      return this.$refs.transformer.getNode();
    },
    stuffLayer() {
      return this.$refs.stuffLayer.getNode();
    },
  },
  data() {
    return {
      editorConfig: {
        width: 200,
        height: 200
      },
      shapes: [],
      tplImage: {
        image: null
      },
      transformerConfig: {
        nodes: [],
        keepRatio: true,
        anchorSize: 10,
        rotationSnaps: snaps,
      }
    }
  },
  created() {
    const tpl = new window.Image();
    const baseUrl = process.env.BASE_URL;
    tpl.src = `${baseUrl}moto_G5_template.png`;
    tpl.onload = () => {
      this.tplImage = {
        image: tpl,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
      };
      this.editorConfig.width = tpl.width;
      this.editorConfig.height = tpl.height;
    };
  },
  mounted() {
    this.$refs.fileInput.addEventListener('change', (e) => {
      const [file] = e.target.files;
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        const imgConf = {
          image: img,
          x: 50,
          y: 180,
          scaleX: 0.4,
          scaleY: 0.4,
          draggable: true,
        };
        this.shapes = [...this.shapes, { shape: 'image', config: imgConf }]
      };
    });
  }
};
</script>

<style scoped>

</style>