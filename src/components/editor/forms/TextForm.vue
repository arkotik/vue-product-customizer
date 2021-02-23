<!--suppress HtmlFormInputWithoutLabel -->
<template>
  <div>
    <div style="padding: 0 10px;">
      <div class="input-group">
        <span class="input-label">Text</span>
        <div class="input-field">
          <textarea rows="4" v-model="conf.text" @input="submitText" />
        </div>
      </div>
    </div>
    <ColorPicker title="Color" v-model="conf.fill" @change="submitFill" />
  </div>
</template>

<script>
import ColorPicker from '@/components/editor/ColorPicker';
import Konva from 'konva';
import { rgbToHEX } from '@/components/editor/helpers';

export default {
  name: 'TextForm',
  components: { ColorPicker },
  props: {
    attrs: Object,
    onInput: Function,
  },
  methods: {
    submitText() {
      this.submit('text', this.conf.text);
    },
    submitFill(val) {
      this.submit('fill', val);
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
