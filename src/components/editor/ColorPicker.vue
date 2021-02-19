<template>
  <div class="color-picker">
    <div class="input-group">
      <span class="input-label">{{ title }}</span>
      <div class="input-field text-with-button">
        <label>
          <input type="text" v-bind:value="normalized" v-on:change="onChange" @input="onInput"/>
        </label>
        <button class="button" @click="submit">Apply</button>
      </div>
    </div>
    <div class="slider-wrapper">
      <div class="slider">
        <div class="slider-track" ref="sliderTrack">
          <div class="slider-pipka" ref="sliderPipka" :style="{ left: `${slider.left}%`}"/>
        </div>
      </div>
    </div>
    <div class="color-map-wrapper">
      <div class="color-map" ref="colorMap">
        <div class="color-map-background" :style="{ background: colorMap.base }">
          <div class="color-map-background-overlay"/>
        </div>
        <div class="color-map-pipka" ref="colorMapPipka" :style="{ left: `${colorMap.left}%`, bottom: `${colorMap.bottom}%` }"/>
      </div>
    </div>
  </div>
</template>

<script>
import { rgbToHSV, hsvToHEX } from '@/components/editor/helpers';

function isValidHexColor(hex) {
  const rex = new RegExp('^#([a-f0-9]{3}|[a-f0-9]{6})$', 'i');
  return rex.test(hex);
}

function clearHash(hex) {
  return hex.replace(/^#/, '');
}

function normalizeHexColor(value) {
  if (!value.match(/^#/)) {
    return `#${value}`;
  }
  return value;
}

export default {
  name: 'ColorPicker',
  props: {
    title: {
      type: String,
      default: () => 'Color',
    },
    value: {
      type: String,
      default: () => '#ffffff',
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  computed: {
    normalized() {
      return clearHash(this.value);
    },
  },
  methods: {
    submit() {
      this.emit(this.normalized);
    },
    onChange(e) {
      this.emit(clearHash(e.target.value));
    },
    onInput(e) {
      const { value } = e.target;
      if (value.match(/^#/)) {
        e.target.value = clearHash(value);
      }
    },
    emit(value) {
      const hex = normalizeHexColor(value);
      if (isValidHexColor(hex)) {
        this.$emit('change', hex);
        this.updateSlider(hex);
        this.updateMap(hex);
      } else {
        console.error(`Invalid value: ${hex}`);
      }
    },
    updateSlider(hex) {
      this.slider.left = this.getSliderPipkaPos(hex);
    },
    initSlider() {
      const { sliderTrack, sliderPipka } = this.$refs;
      const calcPos = (element, { x }) => {
        const { width, left: offset } = element.getBoundingClientRect();
        let px = x - offset;
        if (px < 0) {
          px = 0;
        } else if (px > width) {
          px = width;
        }
        return px / width;
      };
      window.addEventListener('resize', () => {
        this.initSlider();
      });
      this.updateSlider(this.value);
      const updHandler = (e) => {
        const h = calcPos(sliderTrack, { x: e.clientX });
        this.slider.left = h * 100;
        this.updateColor({ h });
      };
      sliderTrack.onclick = updHandler;
      sliderPipka.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      };
      const onUp = () => {
        window.removeEventListener('mousemove', updHandler);
        window.removeEventListener('mouseup', onUp);
      };
      sliderPipka.onmousedown = (e) => {
        e.stopPropagation();
        window.addEventListener('mousemove', updHandler);
        window.addEventListener('mouseup', onUp);
      };
    },
    getSliderPipkaPos(hex) {
      const percent = rgbToHSV(hex).h / 360 * 100;
      if ((this.slider.left === 100 && percent === 0) || (this.slider.left === 0 && percent === 100)) {
        return;
      }
      return percent;
    },
    updateColor({ h, s, v }) {
      const hsv = rgbToHSV(this.value);
      if (h !== void 0) {
        hsv.h = 360 * h;
      }
      if (s !== void 0) {
        hsv.s = s;
      }
      if (v !== void 0) {
        hsv.v = v;
      }
      this.emit(hsvToHEX(hsv));
    },
    initColorMap() {
      const { colorMap, colorMapPipka } = this.$refs;
      const calcPos = (element, { x, y }) => {
        const { width, height, left: offsetX, bottom: offsetY } = element.getBoundingClientRect();
        let px = x - offsetX;
        let py = offsetY - y;
        if (px < 0) {
          px = 0;
        } else if (px > width) {
          px = width;
        }
        if (py < 0) {
          py = 0;
        } else if (py > height) {
          py = height;
        }
        return { s: px / width, v: py / height };
      };
      const updHandler = e => {
        const { clientX: x, clientY: y } = e;
        const { s, v } = calcPos(colorMap, { x, y });
        this.colorMap.left = s * 100;
        this.colorMap.bottom = v * 100;
        this.updateColor({ s, v });
      };
      colorMap.onclick = updHandler;
      colorMapPipka.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        return false;
      };
      const onUp = () => {
        window.removeEventListener('mousemove', updHandler);
        window.removeEventListener('mouseup', onUp);
      };
      colorMapPipka.onmousedown = (e) => {
        e.stopPropagation();
        window.addEventListener('mousemove', updHandler);
        window.addEventListener('mouseup', onUp);
      };
      this.updateMap(this.value);
    },
    updateMap(hex) {
      const { width, height } = this.$refs.colorMap.getBoundingClientRect();
      const { h, s, v } = rgbToHSV(hex);
      this.colorMap = {
        base: hsvToHEX({ h, s: 1, v: 1 }),
        left: (width * s) / width * 100,
        bottom: (height * v) / height * 100,
      };
    }
  },
  data() {
    return {
      slider: {
        left: 0
      },
      colorMap: {
        base: '#ff0000',
        left: 100,
        bottom: 100,
      },
    };
  },
  mounted() {
    this.initSlider();
    this.initColorMap();
  }
};
</script>

<style type="text/css" lang="scss" scoped>
.color-picker {
  padding: 0 10px;
}

.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;

  .input-label {
    width: 100%;
    padding: 5px 0 10px 0;
    font-size: 1.2em;
  }

  .input-field {
    width: 100%;
    display: flex;
    flex-direction: row;

    &.text-with-button {
      label {
        display: inline-flex;
        border: 1px solid var(--c-primary);
        border-radius: 4px 0 0 4px;
        overflow: hidden;
        position: relative;
        align-items: center;
        border-right: none;

        &:before {
          content: '#';
          display: inline;
          left: 0;
          margin: 0 10px;
          position: relative;
        }

        input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          font-family: monospace;
          letter-spacing: 1px;
          text-transform: lowercase;
        }
      }

      .button {
        display: inline-block;
        max-width: 30%;
        min-width: fit-content;
        padding: 8px 10px;
        border-radius: 0 4px 4px 0;
        outline: none;
        border: none;
        font-weight: bolder;
        background: var(--c-primary);
        color: white;
        cursor: pointer;
      }
    }
  }
}

.slider-wrapper {
  padding: 15px 0;

  .slider {
    position: relative;
    user-select: none;
    height: 6px;
    left: 0;
    right: 0;
    cursor: ew-resize;
    width: 100%;

    .slider-track {
      background: linear-gradient(to left, rgb(255, 0, 0) 0%, rgb(255, 0, 255) 17%, rgb(0, 0, 255) 33%, rgb(0, 255, 255) 50%, rgb(0, 255, 0) 67%, rgb(255, 255, 0) 83%, rgb(255, 0, 0) 100%);
      position: absolute;
      height: 100%;
      left: 0;
      right: 0;
      border-radius: 5px;
    }

    .slider-pipka {
      position: absolute;
      bottom: 50%;
      left: 0;
      width: 22px;
      height: 22px;
      margin-left: -8px;
      margin-bottom: -11px;
      background: var(--c-primary);
      will-change: auto;
      box-sizing: border-box;
      border: 2px solid white;
      border-radius: 50%;
    }
  }
}

.color-map-wrapper {
  padding: 15px 0;
  position: relative;

  .color-map {
    height: 100px;
    position: absolute;
    inset: 0;
    overflow: hidden;
    user-select: none;
    border-radius: 3px;
    cursor: pointer;

    .color-map-background {
      top: 0;
      left: 0;
      position: absolute;
      height: 100%;
      width: 100%;

      .color-map-background-overlay {
        display: block;
        position: absolute;
        inset: 0;
        background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 100%), linear-gradient(to right, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%);
      }
    }

    .color-map-pipka {
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 100%;
      border: 2px solid rgb(255, 255, 255);
      will-change: auto;
      left: 100%;
      bottom: 100%;
      transform: translateX(-50%) translateY(50%);
    }
  }
}
</style>
