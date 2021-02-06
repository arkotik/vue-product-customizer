<template>
  <div class="editor">
    <div class="items-list">
      <template v-for="(item, i) of shapes">
        <div :key="i" class="item" :class="{ active: activeShape === i}" @click="setActive(item, i)">
          <div class="thumb">
            <div v-if="item.shape === 'image'" :style="`background-image: url(${item.config.image.src}) !important`" :class="[item.shape]"/>
          </div>
          <div class="title">{{ item.shape }}</div>
        </div>
      </template>
    </div>
    <div class="canvas-handler">
      <v-stage :config="editorConfig">
        <v-layer ref="stuffLayer">
          <template v-for="(item, i) of shapes">
            <v-image v-if="item.shape === 'image'" :config="item.config" :key="i"/>
          </template>
        </v-layer>
        <v-layer ref="tplLayer">
          <v-image :config="tplImage"/>
        </v-layer>
        <v-layer ref="controlLayer">
          <template v-for="(item, i) of shapes">
            <v-rect :config="getPhantomConfig(item)" :key="i" @mousedown="e => onShapeMouseDown(e, item, i)" :ref="`shape-${i}`"/>
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
    getPhantomConfig(item) {
      const { shape, config: { image, x, y, scaleX, scaleY, width, height, ...rest } } = item;
      const data = {
        ...rest,
        x,
        y,
        scaleX,
        scaleY,
        width,
        height,
        draggable: true,
        strokeWidth: 0,
      };
      if (shape === 'image') {
        if (data.width === void 0) {
          data.width = image.width;
        }
        if (data.height === void 0) {
          data.height = image.height;
        }
      }
      return data;
    },
    addImage() {
      this.$refs.fileInput.click();
    },
    setTransformer(node, item) { // TODO: remove event listeners
      node.addEventListener('xChange', () => {
        item.config.x = node.attrs.x;
      });
      node.addEventListener('yChange', () => {
        item.config.y = node.attrs.y;
      });
      node.addEventListener('scaleXChange', () => {
        item.config.scaleX = node.attrs.scaleX;
      });
      node.addEventListener('scaleYChange', () => {
        item.config.scaleY = node.attrs.scaleY;
      });
      node.addEventListener('rotationChange', () => {
        item.config.rotation = node.attrs.rotation;
      });
      this.transformer.setNodes([node]);
      this.stuffLayer.batchDraw();
      this.transformer.zIndex(this.stuffLayer.children.length - 1);
    },
    onShapeMouseDown(e, item, i) {
      this.activeShape = i;
      this.setTransformer(e.target, item);
    },
    setActive(item, i) {
      const [el] = this.$refs[`shape-${i}`] || [];
      if (!el) {
        console.error('Can not get element');
        return;
      }
      this.activeShape = i;
      this.setTransformer(el.getNode(), item);
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
      },
      activeShape: null,
    };
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
    // const getDataUrl = async (file) => {
    //   const reader = new FileReader();
    //   return new Promise((resolve => {
    //     reader.addEventListener('load', () => {
    //       const { result } = reader;
    //       resolve(result);
    //     });
    //     reader.readAsDataURL(file);
    //   }));
    // };
    this.$refs.fileInput.addEventListener('change', (e) => {
      const [file] = e.target.files;
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        const { width, height } = this.editorConfig;
        const size = Math.max(img.width, img.height);
        const fit = Math.min(width, height);
        const scale = fit < size ? fit / size : 1;
        const imgConf = {
          image: img,
          x: 10,
          y: 10,
          scaleX: scale,
          scaleY: scale,
          draggable: false,
        };
        this.shapes = [...this.shapes, { shape: 'image', config: imgConf }];
      };
    });
  },
};
</script>

<style scoped>

</style>
