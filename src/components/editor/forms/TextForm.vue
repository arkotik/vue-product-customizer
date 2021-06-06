<!--suppress HtmlFormInputWithoutLabel -->
<template>
  <div class="text-form form-wrapper">
    <div>
      <div class="input-group">
        <span class="input-label">Text</span>
        <div class="input-field">
          <textarea rows="4" v-model="conf.text" @input="submitText" @change="emitChange"/>
        </div>
      </div>
    </div>
    <DropDownList v-model="conf.fontFamily" :items="fontsList" title="Font style" @change="submitFontFamily"/>
    <ColorPicker title="Color" :value="conf.fill" @input="submitFill" @change="emitChange"/>
    <RangeSlider title="Font Size" :min="9" :max="200" :ticks="8" :value="conf.fontSize" @input="submitFontSize" @change="emitChange"/>
    <RangeSlider title="Rotation" :min="0" :max="360" :ticks="6" :value="conf.rotation" @input="submitRotation" @change="emitChange"/>
  </div>
</template>

<script>
import ColorPicker from '@/components/editor/ColorPicker';
import Konva from 'konva';
import { rgbToHEX } from '@/components/editor/helpers';
import DropDownList from '@/components/DropDownList';
import { FONTS_LIST } from '@/components/editor/enums/Fonts';
import RangeSlider from '@/components/RangeSlider';

export default {
  name: 'TextForm',
  components: { RangeSlider, DropDownList, ColorPicker },
  props: {
    node: Konva.Text,
    onInput: Function,
  },
  watch: {
    attrs: {
      handler(attrs) {
        this.conf = {
          ...attrs,
          fill: this.rgb(attrs.fill),
          rotation: attrs.rotation < 0 ? 360 + attrs.rotation : attrs.rotation,
        };
      },
      deep: true,
    }
  },
  computed: {
    attrs() {
      return this.node.getAttrs();
    },
    fontsList() {
      return FONTS_LIST.map(font => {
        const { fontFamily: value } = font;
        return { value, text: `<span style="font-family: ${value}">${value}</span>` };
      });
    }
  },
  methods: {
    emitChange() {
      this.$emit('change', this.attrs);
    },
    findFont(name) {
      return FONTS_LIST.find(el => el.fontFamily === name);
    },
    submitText() {
      this.submit('text', this.conf.text);
    },
    submitFill(val) {
      this.submit('fill', val);
    },
    submitFontFamily(val) {
      this.submit('fontFamily', val);
      this.emitChange();
    },
    submitFontSize(val) {
      this.submit('fontSize', val);
    },
    submitRotation(val) {
      this.submit('rotation', val);
    },
    submit(...args) {
      if (typeof this.onInput === 'function') {
        this.onInput(...args);
      }
    },
    rgb(color) {
      return rgbToHEX(Konva.Util.getRGB(color));
    }
  },
  data() {
    return {
      conf: {},
    };
  },
  created() {
    this.conf = { ...this.attrs, fill: this.rgb(this.attrs.fill) };
  }
};
</script>

<style type="text/css" lang="scss">
.text-form {
  padding: 10px;

  & > div {
    margin-bottom: 5px;
  }
}
</style>