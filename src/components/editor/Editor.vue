<template>
  <div class="editor">
    <div class="items-list">
      <template v-for="(item, i) of shapes">
        <div :key="i" class="item" :class="{ active: activeShape === item.id}" @click="setActive(item)">
          <div class="thumb">
            <div v-if="item.shape === 'image'" :style="`background-image: url(${item.config.image.src}) !important`" :class="[item.shape]"/>
          </div>
          <div class="content">
            <div class="title">{{ item.shape }}</div>
            <div class="actions">
              <button class="action action-button to-top" title="Bring to Front" @click.stop="arrangeItem(item, Infinity)"/>
              <button class="action action-button up" title="Forward One" @click.stop="arrangeItem(item, 1)"/>
              <button class="action action-button down" title="Back One" @click.stop="arrangeItem(item, -1)"/>
              <button class="action action-button to-bottom" title="Send to Back" @click.stop="arrangeItem(item, -Infinity)"/>
              <div class="divider"/>
              <button class="action action-button remove" title="Remove" @click.stop="removeItem(item.id)"/>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="canvas-handler">
      <v-stage :config="editorConfig">
        <v-layer ref="stuffLayer">
          <template v-for="(item, i) of shapes">
            <v-image v-if="item.shape === 'image'" :config="item.config" :key="i" ref="shapes"/>
          </template>
        </v-layer>
        <v-layer ref="tplLayer">
          <v-image :config="tplImage"/>
        </v-layer>
        <v-layer ref="controlLayer">
          <template v-for="(item, i) of shapes">
            <v-rect :config="getPhantomConfig(item)" :key="i" @mousedown="e => onShapeMouseDown(e, item)" ref="phantoms"/>
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

function getCounter() {
  let i = 0;
  return () => i++;
}

const SHAPE_IMAGE = 'image';
// const SHAPE_RECT = 'rect';

const listenersMap = [
  ['xChange', 'x'],
  ['yChange', 'y'],
  ['scaleXChange', 'scaleX'],
  ['scaleYChange', 'scaleY'],
  ['rotationChange', 'rotation'],
];
export default {
  name: 'Editor',
  methods: {
    getIndex(id) {
      return this.shapes.findIndex(el => el.id === id);
    },
    getItemById(id) {
      return this.shapes.find(el => el.id === id);
    },
    getNodeById(id) {
      const index = this.getIndex(id);
      return {
        phantom: this.$refs.phantoms[index]?.getNode(),
        shape: this.$refs.shapes[index]?.getNode(),
      };
    },
    arrangeItem(item, to) {
      const { phantom, shape } = this.getNodeById(item.id);
      if (!phantom || !shape) {
        return;
      }
      const max = this.stuffLayer.children.length - 1;
      let zIndex = shape.zIndex();
      if (to === -Infinity) {
        zIndex = 0;
      } else if (to === Infinity) {
        zIndex = max;
      } else {
        zIndex += to;
      }
      if (zIndex > max) {
        return;
      }
      shape.zIndex(zIndex);
      phantom.zIndex(zIndex);
      this.stuffLayer.batchDraw();
    },
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
    setTransformer(node, item) {
      const prev = this.activeShape;
      if (item.id === prev) {
        return;
      }
      this.activeShape = item.id;
      if (prev !== null) {
        const { phantom } = this.getNodeById(prev);
        listenersMap.forEach(([event]) => phantom.removeEventListener(event));
      }
      listenersMap.forEach(([event, attribute]) => node.addEventListener(event, () => {
        item.config[attribute] = node.attrs[attribute];
      }));
      this.transformer.setNodes([node]);
      this.controlLayer.batchDraw();
      this.transformer.zIndex(this.controlLayer.children.length - 1);
    },
    onShapeMouseDown(e, item) {
      this.setTransformer(e.target, item);
    },
    setActive(item) {
      const shapes = this.$refs.phantoms || [];
      const index = this.shapes.findIndex(el => el.id === item.id);
      const el = shapes[index];
      if (!el) {
        console.error('Can not get element');
        return;
      }
      this.setTransformer(el.getNode(), item);
    },
    removeTransformer() {
      this.transformer.setNodes([]);
      this.stuffLayer.batchDraw();
    },
    removeItem(id) {
      if (this.activeShape === id) {
        this.removeTransformer();
      }
      this.activeShape = null;
      this.shapes = this.shapes.filter(el => el.id !== id);
    },
    addShape(shape, config) {
      this.shapes = [...this.shapes, { shape, config, id: this.next() }];
    }
  },
  computed: {
    transformer() {
      return this.$refs.transformer.getNode();
    },
    stuffLayer() {
      return this.$refs.stuffLayer.getNode();
    },
    controlLayer() {
      return this.$refs.controlLayer.getNode();
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
      next: getCounter(),
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
      if (!file) {
        return;
      }
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
        this.addShape(SHAPE_IMAGE, imgConf);
      };
    });
  },
};
</script>

<style scoped>

</style>
