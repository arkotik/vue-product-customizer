<template>
  <div class="input-group range-slider" :style="{ '--range-slider-ticks': ticks }">
    <span v-if="title" class="input-label">{{ title }}</span>
    <div class="slider-wrapper">
      <div class="slider">
        <div class="slider-pipka" ref="sliderPipka" :style="{ left: pipkaPos }"/>
        <div class="slider-track" ref="sliderTrack"/>
      </div>
    </div>
    <div class="values-row">
      <span class="value-label min">{{ min }}</span>
      <span class="value-label value">{{ value }}</span>
      <span class="value-label max">{{ max }}</span>
    </div>
  </div>
</template>

<script>
const DEFAULT_MIN = 0;

export default {
  name: 'RangeSlider',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    title: String,
    value: {
      type: [Number, String],
      default: () => DEFAULT_MIN,
      validator: (value) => !isNaN(+value),
    },
    precision: {
      type: [Number, String],
      default: () => 0,
      validator: (value) => !isNaN(+value),
    },
    min: {
      type: [Number, String],
      default: () => DEFAULT_MIN,
      validator: (value) => !isNaN(+value),
    },
    max: {
      type: [Number, String],
      default: () => 100,
      validator: (value) => !isNaN(+value),
    },
    ticks: {
      type: [Number, String],
      default: () => 10,
      validator: (value) => !isNaN(+value),
    },
  },
  computed: {
    pipkaPos() {
      return `${this.pipkaLeft}%`;
    }
  },
  methods: {
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
      const updHandler = (e) => {
        const pos = calcPos(sliderTrack, { x: e.clientX });
        this.updateValue(pos);
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
    updateValue(offset) {
      const { min, max } = this;
      const val = +min + Math.abs(max - min) * offset;
      this.pipkaLeft = offset * 100;
      this.$emit('change', this.roundVal(val, this.precision));
    },
    roundVal(val, precision) {
      return +(val.toFixed(precision));
    },
  },
  data() {
    return {
      pipkaLeft: 0,
    };
  },
  mounted() {
    this.initSlider();
  },
  created() {
    const { min, max, value } = this;
    this.pipkaLeft = this.roundVal((value - min) / (max - min) * 100, this.precision);
  }
};
</script>

<style type="text/css" lang="scss" scoped>
.range-slider {
  --range-slider-ticks: 10;

  .slider-wrapper {
    padding: 0;

    .slider {
      width: 100%;
      height: 22px;
      position: relative;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      .slider-track {
        width: 100%;
        height: 4px;
        background: var(--c-primary);
        overflow: hidden;
        z-index: 1;
      }

        &:after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(90deg, var(--c-primary) 2px, transparent 0, transparent);
          background-repeat: repeat-x;
          background-size: calc((100% - 2px) / var(--range-slider-ticks)) 10px;
          background-position: 0;
          box-sizing: border-box;
          overflow: hidden;
        }
      }

      .slider-pipka {
        margin-left: -8px;
        margin-bottom: -11px;

        box-sizing: border-box;
        border: 2px solid #fff;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background-color: var(--c-primary);
        top: calc(50% - 11px);
        right: auto;
        bottom: auto;
        left: 0;
        position: absolute;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        z-index: 2;
      }
    }

  .values-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .value-label {
      font-size: x-small;

      &.min {
        width: 25%;
        text-align: left;
      }
      &.max {
        width: 25%;
        text-align: right;
      }
      &.value {
        padding: 1px 10px;
        min-width: 50px;
        text-align: center;
        font-size: 0.9em;
        border: 1px solid var(--c-primary);
        border-radius: 4px;
      }
    }

  }
}
</style>