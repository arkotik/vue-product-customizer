<template>
  <div class="editor">
    <div class="panel left-panel">
      <div class="control-buttons">
        <div class="buttons-group">
          <div class="button primary" @click.stop="addImage">+ Image</div>
          <div class="button primary" @click.stop="addText">+ Text</div>
        </div>
        <div class="buttons-group">
          <div class="button danger" @click.stop="clearAll">Clear all</div>
        </div>
      </div>
      <div class="items-list">
        <template v-for="(item, i) of shapes">
          <div :key="i" class="item" :class="{ active: activeShape === item.id}" @click.stop="setActive(item)">
            <div class="thumb">
              <div v-if="item.shape === 'image'" :style="`background-image: url(${item.config.image.src}) !important`" :class="[item.shape]"/>
              <div v-if="item.shape === 'text'" :class="[item.shape]">
                <svg viewBox="0 0 1024 1024">
                  <path d="M213.333 170.667v128h234.667v512h128v-512h234.667v-128z"></path>
                </svg>
              </div>
            </div>
            <div class="title">{{ item.shape }}</div>
            <div class="action action-button remove" title="Remove" @click.stop="removeItem(item)">
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
                      <g fill="#787878">
                        <path d="M685.9,329h-45c-10,0-18.3,8.3-18.3,18.3V827c0,10.1,8.3,18.3,18.3,18.3h45c10,0,18.3-8.3,18.3-18.3V347.3C704.2,337.2,695.9,329,685.9,329z"/>
                        <path d="M971.7,173.3H729.1L687.5,65.7C674.3,31.5,643,10,606.3,10H393.8c-36.8,0-68,21.5-81.2,55.7L271,173.3H28.3c-10,0-18.3,8.3-18.3,18.3v45.1c0,10,8.3,18.3,18.3,18.3h104.2v626.5c0,59.7,48.8,108.5,108.5,108.5H759c59.7,0,108.5-48.8,108.5-108.5V255h104.2c10,0,18.3-8.3,18.3-18.3v-45.1C990.1,181.6,981.8,173.3,971.7,173.3z M371.9,118.1c6.6-17.1,22.3-27.9,40.7-27.9h174.9c18.4,0,34.1,10.7,40.6,27.9l21.4,55.2H350.6L371.9,118.1z M786,870.6c0,20.8-17,37.8-37.8,37.8H251.9c-20.8,0-37.7-17-37.7-37.8V255H786V870.6z"/>
                        <path d="M359.2,329h-45c-10.1,0-18.3,8.3-18.3,18.3V827c0,10.1,8.2,18.3,18.3,18.3h45c10,0,18.3-8.3,18.3-18.3V347.3C377.6,337.2,369.3,329,359.2,329z"/>
                        <path d="M522.5,329h-45c-10,0-18.3,8.3-18.3,18.3V827c0,10.1,8.3,18.3,18.3,18.3h45c10.1,0,18.4-8.3,18.4-18.3V347.3C540.9,337.2,532.6,329,522.5,329z"/>
                      </g>
                    </svg>
              </i>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="editor-area">
      <div class="canvas-wrapper" ref="canvasArea">
        <v-stage :config="editorConfig">
          <v-layer ref="backLayer">
            <v-rect :config="underlayConfig" ref="underlay"/>
          </v-layer>
          <v-layer ref="stuffLayer"/>
          <v-layer ref="tplLayer">
            <v-image :config="tplImage"/>
          </v-layer>
          <v-layer ref="controlLayer"/>
          <v-layer ref="transformerLayer">
            <v-transformer ref="transformer" :config="transformerConfig"/>
          </v-layer>
        </v-stage>
      </div>
    </div>
    <div class="panel right-panel" ref="rightPanel">
      <div class="tabs">
        <template v-for="(tab, i) in settingsTabs.tabs">
          <div class="tab-tile" :class="{ active: tab.id === settingsTabs.active }" @click="settingsTabs.active = tab.id" :key="i">{{ tab.title }}</div>
        </template>
      </div>
      <div class="tools-handler" :class="[`${settingsTabs.active}-content`]">
        <div class="tools-panel" v-if="settingsTabs.active === 'tab-product'">
          <div class="tools-group">
            <div style="padding: 0 10px">
              <ColorPicker title="Background" v-model="underlayConfig.fill"/>
            </div>
          </div>
        </div>
        <div class="tools-panel" v-if="settingsTabs.active === 'tab-object'">
          <template v-if="activeShape === null">
            <span style="text-align: center; padding: 15px 0;">Please select an objet</span>
          </template>
          <div class="tools-group" v-if="activeShape !== null">
            <TransformForm :node="activeItem.node" :onInput="updateAttribute" style="border-bottom: 1px solid #98a0b1;" :on-arrange="to => arrangeItem(activeItem, to)"/>
          </div>
          <template v-if="activeType === 'text'">
            <div class="tools-group">
              <TextForm :attrs="activeItem.node.attrs" :onInput="updateAttribute"/>
            </div>
          </template>
          <template v-if="activeType === 'image'">
            <div class="tools-group">
              <ImageForm :attrs="activeItem.node.attrs" :onInput="updateAttribute" :filter="activeItem.filter"/>
            </div>
          </template>
        </div>
      </div>
    </div>
    <form action="javascript:void(0)" ref="imageForm">
      <input type="file" accept="image/*" hidden ref="fileInput">
    </form>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

import ColorPicker from '@/components/editor/ColorPicker';
import Konva from 'konva';
import TextForm from '@/components/editor/forms/TextForm';
import ImageForm from '@/components/editor/forms/ImageForm';
// import { rgbToHEX } from '@/components/editor/helpers';
import TransformForm from '@/components/editor/forms/TransformForm';

const filtersMap = {
  sepia: Konva.Filters.Sepia,
  invert: Konva.Filters.Invert,
  solarize: Konva.Filters.Solarize,
  grayscale: Konva.Filters.Grayscale,
};

const snaps = Array(4)
  .fill([0, 30, 45, 60, 90])
  .reduce((acc, cur, i) => [...acc, ...cur.map(el => el + (i * 90))], []);

function getCounter() {
  let i = 0;
  return () => i++;
}

const SHAPE_IMAGE = 'image';
const SHAPE_TEXT = 'text';

function getTextConfig(config = {}) {
  return {
    x: 0,
    y: 0,
    text: 'Your Text',
    fontSize: 14,
    align: 'left',
    scaleX: 1,
    scaleY: 1,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontVariant: 'normal',
    // textDecoration: '',
    // verticalAlign: 'top',
    // padding: 0,
    // lineHeight: 1,
    // wrap: 'word',
    // ellipsis: false,
    // fill: '#000000',
    // fillEnabled: false,
    // stroke: '#000000',
    // strokeWidth: 1,
    // strokeEnabled: false,
    // visible: true,
    // opacity: 1.0,
    // rotation: 0,
    ...config,
  };
}

const listenersMap = [
  ['xChange', 'x'],
  ['yChange', 'y'],
  ['scaleXChange', 'scaleX'],
  ['scaleYChange', 'scaleY'],
  ['rotationChange', 'rotation'],
];

// async function sleep(t = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, t);
//   });
// }
//
// const rotatePoint = ({ x, y }, rad) => {
//   const rcos = Math.cos(rad);
//   const rsin = Math.sin(rad);
//   return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
// };
//
// function rotateAroundCenter(node, rotation) {
//   const topLeft = { x: -node.width() / 2, y: -node.height() / 2 };
//   const current = rotatePoint(topLeft, Konva.getAngle(node.rotation()));
//   const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));
//   return {
//     rotation,
//     x: node.x() + (rotated.x - current.x),
//     y: node.y() + (rotated.y - current.y),
//   };
// }

export default {
  name: 'Editor',
  components: { TransformForm, ImageForm, TextForm, ColorPicker },
  methods: {
    clearAll() {
      this.removeTransformer();
      this.activeShape = null;
      for (const { node, phantom } of this.shapes) {
        node.destroy();
        phantom.destroy();
      }
      this.controlLayer.batchDraw();
      this.stuffLayer.batchDraw();
      this.shapes = [];
    },
    getItemById(id) {
      return this.shapes.find(el => el.id === id);
    },
    getNodeById(id) {
      const { node: shape, phantom } = this.getItemById(id);
      return { phantom, shape };
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
      this.controlLayer.batchDraw();
      this.transformerLayer.batchDraw();
    },
    getPhantomConfig(item) {
      const { shape, config: { image, x, y, scaleX, scaleY, width, height, offsetX, offsetY } } = item;
      const data = {
        x,
        y,
        scaleX,
        scaleY,
        width,
        height,
        offsetX,
        offsetY,
        draggable: true,
        strokeWidth: 1,
        strokeEnabled: false,
        stroke: '#000000',
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
    addText() {
      const config = getTextConfig({
        fontSize: 32,
        text: 'Your Text',
      });
      this.addShape(SHAPE_TEXT, config);
    },
    setActive(item) {
      this.setTransformer(item);
      this.settingsTabs.active = 'tab-object';
      window.activeNode = item.node;
    },
    setTransformer(item) {
      const { phantom, node, config, id, shape } = item;
      const prev = this.activeShape;
      if (item.id === prev) {
        return;
      }
      this.activeShape = id;
      if (prev !== null) {
        const { phantom } = this.getNodeById(prev);
        listenersMap.forEach(([event]) => phantom.removeEventListener(event));
      }
      listenersMap.forEach(([event, attribute]) => phantom.addEventListener(event, () => {
        config[attribute] = phantom.attrs[attribute];
        node.setAttr(attribute, phantom.attrs[attribute]);
        node.draw();
        this.stuffLayer.draw();
      }));
      this.$set(this.$data, 'transformerConfig', { ...this.transformerConfig, resizeEnabled: shape !== SHAPE_TEXT });
      this.transformer?.setNodes([phantom]);
      this.transformerLayer.batchDraw();
      this.stuffLayer.batchDraw();
    },
    removeTransformer() {
      this.transformer?.setNodes([]);
      this.transformerLayer?.batchDraw();
    },
    removeItem(item) {
      if (this.activeShape === item.id) {
        this.removeTransformer();
      }
      const { node, phantom } = item;
      node.destroy();
      phantom.destroy();
      this.activeShape = null;
      this.shapes = this.shapes.filter(el => el.id !== item.id);
      this.stuffLayer.batchDraw();
      this.controlLayer.batchDraw();
    },
    addShape(shape, config, extra = {}) {
      const { width, height } = this.editorConfig;
      const item = { ...(extra || {}), shape, config, id: this.next() };
      if (shape === SHAPE_IMAGE) {
        item.filter = 'none';
        item.node = new Konva.Image(config);
      } else if (shape === SHAPE_TEXT) {
        item.node = new Konva.Text(config);
        const tw = item.node.getTextWidth();
        const th = item.node.height();
        config.width = tw;
        config.height = th;
        config.x = ~~((width / 2));
        config.y = ~~((height / 2));
        config.offsetX = config.width / 2;
        config.offsetY =config.height / 2;
        item.node.setAttrs(config);
      }
      item.phantom = new Konva.Rect(this.getPhantomConfig(item));

      this.controlLayer.add(item.phantom);
      this.stuffLayer.add(item.node);

      this.stuffLayer.batchDraw();
      this.controlLayer.batchDraw();

      this.shapes.unshift(item);

      item.phantom.addEventListener('mousedown', () => this.setActive(item));
      this.setActive(item);
    },
    updateAttribute(attribute, value) {
      const { config, node, shape, phantom } = this.activeItem;
      if (attribute.startsWith('__')) {
        if (attribute === '__filter') {
          this.activeItem.filter = value;
          if (value === 'none') {
            node.clearCache();
            node.filters([]);
            this.stuffLayer.batchDraw();
          } else if (value in filtersMap) {
            node.cache();
            node.filters([filtersMap[value]]);
            this.stuffLayer.batchDraw();
          }
        }
        return;
      }
      if (attribute === 'rotation') {
        // const { rotation, x, y } = rotateAroundCenter(phantom, value);
        config.rotation = value;
        // config.x = x;
        // config.y = y;
      } else {
        config[attribute] = value;
        if (shape === SHAPE_TEXT) {
          node.setAttr(attribute, value);
          const text = node.text();
          const { height } = node.measureSize(text);
          const lines = text.split('\n');
          config.width = Math.max(...lines.map(lineText => node.measureSize(lineText).width));
          config.height = lines.length * height;
          if (!attribute.startsWith('scale')) {
            config.scaleX = 1;
            config.scaleY = 1;
          }
          config.x = node.attrs.x - ~~((config.width - node.attrs.width) / 2);
          config.y = node.attrs.y - ~~((config.height - node.attrs.height) / 2);
        }
      }
      node.setAttrs(config);
      this.stuffLayer.batchDraw();
      this.updatePhantomSize(phantom, config);
    },
    updatePhantomSize(phantom, config) {
      const { x, y, width, height, scaleX, scaleY, rotation } = config;
      phantom.setAttrs({ x, y, width, height, scaleX, scaleY, rotation });
      this.controlLayer.batchDraw();
      this.transformer.rotation(rotation);
      this.transformerLayer.batchDraw();
    },
  },
  computed: {
    transformer() {
      return this.$refs?.transformer?.getNode();
    },
    stuffLayer() {
      return this.$refs.stuffLayer.getNode();
    },
    controlLayer() {
      return this.$refs.controlLayer.getNode();
    },
    transformerLayer() {
      return this.$refs.transformerLayer.getNode();
    },
    activeItem() {
      return this.getItemById(this.activeShape) || null;
    },
    activeType() {
      return this.activeItem?.shape || null;
    },
  },
  data() {
    return {
      editorConfig: {
        width: 200,
        height: 200
      },
      underlayConfig: {
        width: 200,
        height: 200,
        fill: '#ffffff',
        strokeEnabled: false,
        strokeWidth: 0
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
        padding: 5,
        rotation: 0,
      },
      activeShape: null,
      next: getCounter(),
      settingsTabs: {
        active: 'tab-product',
        tabs: [
          { id: 'tab-product', title: 'Product' },
          { id: 'tab-object', title: 'Object' },
        ],
      }
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
      this.editorConfig.width = this.underlayConfig.width = tpl.width;
      this.editorConfig.height = this.underlayConfig.height = tpl.height;
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
        this.addShape(SHAPE_IMAGE, {
          image: img,
          x: width / 2,
          y: height / 2,
          scaleX: scale,
          scaleY: scale,
          draggable: false,
          offsetX: img.width / 2,
          offsetY: img.height / 2,
        });
        this.$refs.imageForm.reset();
      };
    });
    this.$refs.canvasArea.addEventListener('click', e => e.stopPropagation());
    this.$refs.rightPanel.addEventListener('click', e => e.stopPropagation());
    document.body.addEventListener('click', () => {
      this.activeShape = null;
      this.removeTransformer();
      this.settingsTabs.active = 'tab-product';
    });
    // setTimeout(() => {
    //   const pixel = 0;
    //   const [r, g, b, a] = this.$refs.tplLayer.getNode().children[0].getContext().getImageData(pixel, pixel, 1, 1).data;
    //   const hex = rgbToHEX({ r, g, b, a });
    //   document.body.style.setProperty('background-color', hex);
    // }, 100);
  },
};
</script>
