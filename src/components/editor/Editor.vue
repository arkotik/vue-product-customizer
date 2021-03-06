<template>
  <div class="editor">
    <div class="panel left-panel">
      <div class="control-buttons">
        <div class="buttons-group">
          <div class="button primary" @click.stop="addImage">+ Image</div>
          <div class="button primary" @click.stop="addText">+ Text</div>
        </div>
        <div class="buttons-group">
          <div class="button danger" @click.stop="onClearAll">Clear all</div>
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
    <div class="editor-area" ref="editorArea">
      <div class="template-switcher">
        <template v-for="(tpl, i) in templates">
          <div class="template-variant" :key="i" :class="{ active: tpl.id === currentTemplate }" @click="setTemplate(tpl.id)">
            <div class="tpl-thumb" :style="{ 'background-image': `url(${tpl.thumb})` }" />
            <span class="tpl-title">{{ tpl.title }}</span>
          </div>
        </template>
      </div>
      <div class="canvas-wrapper" ref="canvasArea">
        <v-stage :config="editorConfig" ref="stage">
          <v-layer ref="backLayer">
            <v-rect :config="underlayConfig" ref="underlay"/>
          </v-layer>
          <v-layer ref="stuffLayer"/>
          <v-layer ref="tplLayer">
            <v-image :config="tplImage"/>
            <v-path :config="tplFrame" ref="tplFrame" />
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
          <div class="tab-tile" :class="{ active: tab.id === settingsTabs.active }" @click="toggleTab(tab.id)" :key="i">{{ tab.title }}</div>
        </template>
      </div>
      <div class="tools-handler" :class="[`${settingsTabs.active}-content`]">
        <div class="tools-panel" v-if="settingsTabs.active === TAB_PRODUCT">
          <div class="tools-group">
            <div style="padding: 0 10px">
              <ColorPicker title="Background" @input="fill => updateUnderlay({ fill })" :value="underlayConfig.fill" @change="pushHistory"/>
            </div>
          </div>
        </div>
        <div class="tools-panel" v-if="settingsTabs.active === TAB_OBJECT">
          <template v-if="activeShape === null">
            <div style="height: 100%; display: flex; align-items: center; justify-content: center;">
              <span>Please select an objet</span>
            </div>
          </template>
          <div class="tools-group" v-if="activeShape !== null">
            <TransformForm
              :node="activeItem.node"
              :on-transform="updateAttribute"
              :on-arrange="to => arrangeItem(activeItem, to)"
              style="border-bottom: 1px solid #98a0b1;"
            />
          </div>
          <template v-if="activeType === 'text'">
            <div class="tools-group">
              <TextForm :node="activeItem.node" :onInput="updateAttribute" @change="pushHistory"/>
            </div>
          </template>
          <template v-if="activeType === 'image'">
            <div class="tools-group">
              <ImageForm :node="activeItem.node" :filter="activeItem.filter" :onInput="updateAttribute" @change="pushHistory"/>
            </div>
          </template>
        </div>
      </div>
    </div>
    <form action="javascript:void(0)" ref="imageForm">
      <input type="file" accept="image/*" hidden ref="fileInput">
    </form>
    <div class="status-bar" v-if="activeShape !== null">
      <div class="position">
        <span>X: {{ activeItem.node.x().toFixed(2) }}</span>
        <span>Y: {{ activeItem.node.y().toFixed(2) }}</span>
      </div>
      <div class="size">
        <span>W: {{ activeItem.node.width().toFixed(2) }}</span>
        <span>H: {{ activeItem.node.height().toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */

// import { rgbToHEX } from '@/components/editor/helpers';
import ColorPicker from '@/components/editor/ColorPicker';
import Konva from 'konva';
import TextForm from '@/components/editor/forms/TextForm';
import ImageForm from '@/components/editor/forms/ImageForm';
import TransformForm from '@/components/editor/forms/TransformForm';
import EditorHistory from '@/components/editor/EditorHistory';
import { bounded } from '@/components/editor/helpers';
import '../../assets/styles.scss';

const filtersMap = {
  sepia: Konva.Filters.Sepia,
  invert: Konva.Filters.Invert,
  solarize: Konva.Filters.Solarize,
  grayscale: Konva.Filters.Grayscale,
};

const snaps = Array(4)
  .fill([0, 30, 45, 60, 90])
  .reduce((acc, cur, i) => [...acc, ...cur.map(el => el + (i * 90))], []);

function getCounter(start = 0) {
  let i = start;
  return () => i++;
}
function downloadURI(uri, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const SHAPE_IMAGE = 'image';
const SHAPE_TEXT = 'text';

const TAB_OBJECT = 'tab-object';
const TAB_PRODUCT = 'tab-product';

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
  props: {
    templates: Array,
  },
  components: { TransformForm, ImageForm, TextForm, ColorPicker },
  methods: {
    toggleTab(id) {
      if (this.settingsTabs.active !== id) {
        this.settingsTabs.active = id;
        if (id === TAB_PRODUCT) {
          this.clearActive();
        }
      }
    },
    clearAll() {
      this.clearActive();
      for (const { node, phantom } of this.shapes) {
        node.destroy();
        phantom.destroy();
      }
      this.controlLayer.batchDraw();
      this.stuffLayer.batchDraw();
      this.shapes = [];
    },
    onClearAll() {
      this.clearAll();
      this.pushHistory();
    },
    getItemById(id) {
      return this.shapes.find(el => el.id === id);
    },
    getNodeById(id) {
      const { node: shape, phantom } = this.getItemById(id);
      return { phantom, shape };
    },
    getTemplateById(id) {
      return this.templates.find(el => el.id === id);
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
      this.pushHistory();
    },
    getPhantomConfig(item) {
      const { width: editorWidth, height: editorHeight } = this.editorConfig;
      const { shape, config: { image, x, y, scaleX, scaleY, width, height, rotation } } = item;
      const data = {
        x,
        y,
        scaleX,
        scaleY,
        width,
        height,
        rotation,
        offsetX: width / 2,
        offsetY: height / 2,
        draggable: true,
        strokeWidth: 1,
        strokeEnabled: false,
        stroke: '#000000',
        dragBoundFunc: function ({ x, y }) {
          const w = Math.abs(width * scaleX) * 0.4;
          const h = Math.abs(height * scaleY) * 0.4;
          return {
            x: bounded(x, -w, editorWidth + w),
            y: bounded(y, -h, editorHeight + h),
          };
        },
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
    setActive(id, transformerConfig = {}) {
      const item = this.getItemById(id);
      if (!item) {
        return;
      }
      this.setTransformer(item, transformerConfig);
      this.settingsTabs.active = TAB_OBJECT;
    },
    setTransformer(item, conf = {}) {
      let transforming = false;
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
        transforming = true;
        config[attribute] = phantom.attrs[attribute];
        node.setAttr(attribute, phantom.attrs[attribute]);
        node.draw();
        phantom.draw();
        this.stuffLayer.draw();
        this.controlLayer.draw();
      }));
      phantom.addEventListener('dragend', this.pushHistory);
      this.$refs.stage.getNode().addEventListener('mouseup', () => {
        if (transforming) {
          this.pushHistory();
          transforming = false;
        }
      });
      this.$set(this.$data, 'transformerConfig', {
        ...this.transformerConfig,
        ...(conf || {}),
        resizeEnabled: shape !== SHAPE_TEXT
      });
      this.transformer?.setNodes([phantom]);
      this.transformerLayer.batchDraw();
      this.controlLayer.batchDraw();
      this.stuffLayer.batchDraw();
    },
    removeTransformer() {
      this.activeShape = null;
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
      this.pushHistory();
    },
    createItem(shape, { filter, id, ...config }, auto = true) {
      const { width, height } = this.editorConfig;
      const item = { shape, config, id };
      if (id === void 0) {
        item.id = this.next();
      }
      if (shape === SHAPE_IMAGE) {
        item.filter = filter || 'none';
        item.node = new Konva.Image(config);
        if (item.filter in filtersMap) {
          item.node.cache();
          item.node.filters([filtersMap[item.filter]]);
        }
      } else if (shape === SHAPE_TEXT) {
        item.node = new Konva.Text(config);
        if (auto) {
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
      }
      item.phantom = new Konva.Rect(this.getPhantomConfig(item));
      item.phantom.addEventListener('mousedown', () => this.setActive(item.id));
      return item;
    },
    addShape(shape, config) {
      const item = this.createItem(shape, config);
      this.controlLayer.add(item.phantom);
      this.stuffLayer.add(item.node);
      this.stuffLayer.batchDraw();
      this.controlLayer.batchDraw();
      this.shapes.unshift(item);
      this.setActive(item.id);
      this.pushHistory();
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
        config.rotation = value;
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
          config.offsetX = config.width / 2;
          config.offsetY = config.height / 2;
          // config.x = node.attrs.x - ~~((config.width - node.attrs.width) / 2);
          // config.y = node.attrs.y - ~~((config.height - node.attrs.height) / 2);
        }
      }
      node.setAttrs(config);
      this.stuffLayer.batchDraw();
      this.updatePhantomSize(phantom, config);
    },
    updatePhantomSize(phantom, config) {
      const { x, y, width, height, scaleX, scaleY, rotation, offsetX, offsetY } = config;
      phantom.setAttrs({ x, y, width, height, scaleX, scaleY, rotation, offsetX, offsetY });
      this.controlLayer.batchDraw();
      this.transformer.rotation(rotation);
      this.transformerLayer.batchDraw();
    },
    hotkeysHandler(e) {
      const { shiftKey, ctrlKey, code } = e;
      if (ctrlKey) {
        if (!shiftKey && code === 'KeyZ') {
          e.preventDefault();
          this.loadState(this.editorHistory.back());
        }
        if ((shiftKey && code === 'KeyZ') || (!shiftKey && code === 'KeyY')) {
          e.preventDefault();
          this.loadState(this.editorHistory.forward());
        }
      } else if (this.activeShape !== null && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Space', 'Delete'].includes(code)) {
        e.preventDefault();
        const { x, y } = this.activeItem.node.position();
        const delta = shiftKey ? 10 : 1;
        switch (code) {
          case 'ArrowUp':
            this.updateAttribute('y', y - delta);
            break;
          case 'ArrowDown':
            this.updateAttribute('y', y + delta);
            break;
          case 'ArrowLeft':
            this.updateAttribute('x', x - delta);
            break;
          case 'ArrowRight':
            this.updateAttribute('x', x + delta);
            break;
          case 'Space':
            ((currentIndex) => {
              let idx = currentIndex + 1;
              if (idx > this.shapes.length - 1) {
                idx = 0;
              }
              this.setActive(this.shapes[Math.max(0, idx)]?.id);
            })(this.shapes.findIndex(el => el.id === this.activeShape));
            break;
          case 'Escape':
            this.clearActive();
            break;
          case 'Delete':
            this.removeItem(this.activeItem);
            break;
        }
      }
    },
    dumpState() {
      const objects = this.shapes.map(({ shape, config: { image, ...config }, id, node, filter }) => {
        const { x, y } = node.position();
        const { width, height } = node.size();
        const { x: scaleX, y: scaleY } = node.scale();
        const { x: offsetX, y: offsetY } = node.offset();
        const rotation = node.rotation();
        const data = { shape, filter, config: { ...config, x, y, width, height, scaleX, scaleY, offsetX, offsetY, rotation } };
        if (shape === SHAPE_IMAGE) {
          data.image = image.src;
        }
        return [id, data];
      });
      return JSON.stringify({ objects, underlay: this.underlayConfig, active: this.activeShape });
    },
    loadState(state) {
      if (!state) {
        return;
      }
      const { underlay, objects, active } = JSON.parse(state);
      const prev = new Map(objects);
      const shapes = [];
      let max = 0;
      let activeConf;
      this.clearActive();
      for (const { node, phantom } of this.shapes) {
        node.destroy();
        phantom.destroy();
      }
      for (const [id, { shape, config, image, filter }] of prev) {
        if (id === active) {
          activeConf = config;
        }
        config.id = id;
        max = Math.max(max, id);
        if (shape === SHAPE_IMAGE) {
          config.image = new window.Image();
          config.image.src = image;
          config.filter = filter;
        }
        const item = this.createItem(shape, config, false);
        this.controlLayer.add(item.phantom);
        this.stuffLayer.add(item.node);
        shapes.push(item);
      }
      this.shapes = shapes;
      this.$set(this.$data, 'underlayConfig', underlay);
      this.next = getCounter(max + 1);
      this.stuffLayer.batchDraw();
      this.controlLayer.batchDraw();
      this.setActive(active);
    },
    pushHistory() {
      console.log('pushed state');
      this.editorHistory.pushState(this.dumpState());
    },
    clearActive() {
      this.activeShape = null;
      this.removeTransformer();
      this.settingsTabs.active = TAB_PRODUCT;
      this.$set(this.$data, 'transformerConfig', { ...this.transformerConfig, rotation: 0, offsetX: 0, offsetY: 0 });
    },
    updateUnderlay(data) {
      this.underlayConfig = { ...this.underlayConfig, ...data };
    },
    setTemplateImage(id) {
      const template = this.getTemplateById(id);
      const tplImg = new window.Image();
      tplImg.src = template.image;
      tplImg.onload = () => {
        const { width: editorWidth, height: editorHeight } = this.editorConfig;
        const common = {
          width: tplImg.width,
          height: tplImg.height,
          x: editorWidth / 2,
          y: editorHeight / 2,
          offsetX: tplImg.width / 2,
          offsetY: tplImg.height / 2,
          scaleX: 1,
          scaleY: 1,
        };
        this.tplImage = { ...common, image: tplImg };
        this.$set(this.$data, 'underlayConfig', { ...this.underlayConfig, ...common });
        this.setTplFrameData(common);
      };
    },
    setTemplate(id) {
      this.clearAll();
      this.currentTemplate = id;
      this.setTemplateImage(id);
      const history = this.histories.get(id);
      this.loadState(history.getState());
    },
    setTplFrameData({ x, y, offsetX, offsetY }) {
      const { width: editorWidth, height: editorHeight } = this.editorConfig;
      const l = (x - offsetX) + 1;
      const r = (x + offsetX) - 1;
      const t = (y - offsetY) + 1;
      const b = (y + offsetY) - 1;
      this.tplFrame.data = `M0,0 L0,${editorWidth} L${editorWidth},${editorHeight} L${editorWidth},0z M${l},${t} L${r},${t} L${r},${b} L${l},${b}z`;
    },
    toDataURL(pixelRatio = 1) {
      const { width: editorWidth, height: editorHeight } = this.editorConfig;
      const { width, height } = this.tplImage;
      return this.$refs.stage.getNode().toDataURL({
        x: (editorWidth - width) / 2,
        y: (editorHeight - height) / 2,
        width,
        height,
        pixelRatio,
      });
    }
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
      return this.$refs?.transformerLayer?.getNode();
    },
    activeItem() {
      return this.getItemById(this.activeShape) || null;
    },
    activeType() {
      return this.activeItem?.shape || null;
    },
    editorHistory() {
      return this.histories.get(this.currentTemplate);
    },
    TAB_OBJECT: () => TAB_OBJECT,
    TAB_PRODUCT: () => TAB_PRODUCT,
  },
  data() {
    return {
      currentTemplate: null,
      histories: new Map(),
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
      tplFrame: {
        fill: '#f0f2ef',
        strokeEnabled: false,
        data: '',
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
        active: TAB_PRODUCT,
        tabs: [
          { id: TAB_PRODUCT, title: 'Product' },
          { id: TAB_OBJECT, title: 'Object' },
        ],
      }
    };
  },
  created() {
    this.currentTemplate = (this.templates.find(tpl => !!tpl.default) || this.templates[0]).id;
    this.histories = new Map(this.templates.map(tpl =>  [tpl.id, new EditorHistory(100)]));
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
    const { width, height } = this.$refs.editorArea.getBoundingClientRect();
    this.editorConfig.width = width;
    this.editorConfig.height = height;
    this.setTemplateImage(this.currentTemplate);
    this.$refs.fileInput.addEventListener('change', (e) => {
      const [file] = e.target.files;
      if (!file) {
        return;
      }
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        const { width: editorWidth, height: editorHeight } = this.editorConfig;
        const { width, height } = this.tplImage;
        const size = Math.max(img.width, img.height);
        const fit = Math.min(width, height);
        const scale = fit < size ? fit / size : 1;
        this.addShape(SHAPE_IMAGE, {
          image: img,
          x: editorWidth / 2,
          y: editorHeight / 2,
          width: img.width,
          height: img.height,
          scaleX: scale,
          scaleY: scale,
          draggable: false,
          offsetX: img.width / 2,
          offsetY: img.height / 2,
        });
        this.$refs.imageForm.reset();
      };
    });
    this.$refs.canvasArea.addEventListener('mousedown', e => e.stopPropagation());
    this.$refs.rightPanel.addEventListener('mousedown', e => e.stopPropagation());
    this.$refs.editorArea.addEventListener('mousedown', this.clearActive);
    window.addEventListener('keydown', this.hotkeysHandler);
    // setTimeout(() => {
    //   const pixel = 0;
    //   const [r, g, b, a] = this.$refs.tplLayer.getNode().children[0].getContext().getImageData(pixel, pixel, 1, 1).data;
    //   const hex = rgbToHEX({ r, g, b, a });
    //   document.body.style.setProperty('background-color', hex);
    // }, 100);
    // window.exportStage = () => downloadURI(this.toDataURL(2), 'moto_g5.png');
    // this.$refs.tplFrame.getNode().addEventListener('mousedown', () => {
    //   this.clearActive();
    // });
  },
};
</script>

<style type="text/css" lang="scss" scoped>
.status-bar {
  position: absolute;
  left: 340px;
  bottom: 10px;
  display: flex;
  flex-direction: row;

  .position, .size {
    line-height: 1;

    &:not(:last-child):after {
      content: '|';
      margin: 0 8px;
    }

    span {
      vertical-align: middle;
      font-family: monospace;

      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
.editor-area {
  position: relative;
}
.template-switcher {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
  width: 100px;
  display: flex;
  flex-direction: column;

  .template-variant {
    width: 100%;
    height: 100px;
    border-radius: 4px;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    border: 1px solid transparent;

    &.active {
      border: 1px solid var(--c-primary);
    }

    .tpl-title {
      text-align: center;
      font-size: smaller;
      padding: 2px 0;
    }

    &:not(:first-child) {
      margin-top: 10px;
    }

    .tpl-thumb {
      width: 90%;
      height: 90%;
      background-size: cover;
    }
  }
}
</style>
