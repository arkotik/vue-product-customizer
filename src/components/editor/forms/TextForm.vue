<!--suppress HtmlFormInputWithoutLabel -->
<template>
  <div style="padding: 0 5px">
    <div>
      <div class="input-group">
        <span class="input-label">Text</span>
        <div class="input-field">
          <textarea rows="4" v-model="conf.text" @input="submitText" />
        </div>
      </div>
    </div>
    <DropDownList v-model="conf.fontFamily" :items="fontsList" title="Font style" @change="submitFont"/>
    <ColorPicker title="Color" v-model="conf.fill" @change="submitFill" />
  </div>
</template>

<script>
import ColorPicker from '@/components/editor/ColorPicker';
import Konva from 'konva';
import { rgbToHEX } from '@/components/editor/helpers';
import DropDownList from '@/components/DropDownList';
import { FONTS_LIST } from '@/components/editor/enums/Fonts';

export default {
  name: 'TextForm',
  components: { DropDownList, ColorPicker },
  props: {
    attrs: Object,
    onInput: Function,
  },
  computed: {
    fontsList() {
      return FONTS_LIST.map(font => {
        const { fontFamily: value } = font;
        return { value, text: `<span style="font-family: ${value}">${value}</span>` };
      });
    }
  },
  methods: {
    findFont(name) {
      return FONTS_LIST.find(el => el.fontFamily === name);
    },
    submitText() {
      this.submit('text', this.conf.text);
    },
    submitFill(val) {
      this.submit('fill', val);
    },
    submitFont(val) {
      // const font = this.findFont(val);
      this.submit('fontFamily', val);
      // this.submit('fontStyle', font.fontStyle);
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
    }
  },
  created() {
    this.conf = { ...this.attrs, fill: this.rgb(this.attrs.fill) };
  }
};
</script>
