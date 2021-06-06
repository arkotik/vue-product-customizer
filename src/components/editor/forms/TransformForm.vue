<template>
  <div class="controls-form form-wrapper">
    <div class="buttons-row transformation">
      <div class="control-button mirror-h" title="Flip horizontal" @click="transform('flip', 'h')">
        <i>
          <svg viewBox="0 0 1024 1024">
            <path
              d="M640 896h85.333v-85.333h-85.333v85.333zM810.667 384h85.333v-85.333h-85.333v85.333zM128 213.333v597.333c0 46.933 38.4 85.333 85.333 85.333h170.667v-85.333h-170.667v-597.333h170.667v-85.333h-170.667c-46.933 0-85.333 38.4-85.333 85.333zM810.667 128v85.333h85.333c0-46.933-38.4-85.333-85.333-85.333zM469.333 981.333h85.333v-938.667h-85.333v938.667zM810.667 725.333h85.333v-85.333h-85.333v85.333zM640 213.333h85.333v-85.333h-85.333v85.333zM810.667 554.667h85.333v-85.333h-85.333v85.333zM810.667 896c46.933 0 85.333-38.4 85.333-85.333h-85.333v85.333z"></path>
          </svg>
        </i>
      </div>
      <div class="control-button mirror-v" title="Flip vertical" @click="transform('flip', 'v')">
        <i>
          <svg viewBox="0 0 1024 1024">
            <path
              d="M128 640v85.333h85.333v-85.333h-85.333zM640 810.667v85.333h85.333v-85.333h-85.333zM810.667 128h-597.333c-46.933 0-85.333 38.4-85.333 85.333v170.667h85.333v-170.667h597.333v170.667h85.333v-170.667c0-46.933-38.4-85.333-85.333-85.333zM896 810.667h-85.333v85.333c46.933 0 85.333-38.4 85.333-85.333zM42.667 469.333v85.333h938.667v-85.333h-938.667zM298.667 810.667v85.333h85.333v-85.333h-85.333zM810.667 640v85.333h85.333v-85.333h-85.333zM469.333 810.667v85.333h85.333v-85.333h-85.333zM128 810.667c0 46.933 38.4 85.333 85.333 85.333v-85.333h-85.333z"></path>
          </svg>
        </i>
      </div>
      <div class="control-button center-h" title="Align horizontal" @click="transform('align', 'h')">
        <i>
          <svg viewBox="0 0 1024 1024">
            <path d="M213.333 341.333v128l-170.667 0v85.333h170.667v128l170.667-170.667-170.667-170.667zM810.667 682.667v-128h170.667v-85.333h-170.667v-128l-170.667 170.667 170.667 170.667zM554.667 170.667h-85.333v682.667h85.333v-682.667z"></path>
          </svg>
        </i>
      </div>
      <div class="control-button center-v" title="Align vertical" @click="transform('align', 'v')">
        <i>
          <svg viewBox="0 0 1024 1024">
            <path d="M341.333 810.667h128v170.667h85.333v-170.667h128l-170.667-170.667-170.667 170.667zM682.667 213.333h-128v-170.667h-85.333v170.667h-128l170.667 170.667 170.667-170.667zM170.667 469.333v85.333h682.667v-85.333h-682.667z"></path>
          </svg>
        </i>
      </div>
    </div>
    <div class="buttons-row arrangement">
      <div class="control-button arrange bring-to-front" title="Bring to Front" @click="arrange(Infinity)">
        <i>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 280 280" width="280" height="280">
            <defs>
              <path d="M0 0L132 0L132 132L0 132L0 0Z" id="h78BYsXhGZ"></path>
              <path d="M148 148L280 148L280 280L148 280L148 148Z" id="aqWpmy35m"></path>
              <path d="M37.5 37.51L94.5 37.51L94.5 94.51L37.5 94.51L37.5 37.51Z" id="a27dmBsRH4"></path>
              <path d="M185.5 185.5L242.5 185.5L242.5 242.5L185.5 242.5L185.5 185.5Z" id="iU4acl8wI"></path>
              <path d="M56 56L224 56L224 224L56 224L56 56Z" id="a30utWt0RT"></path>
              <path d="M74 74L206 74L206 206L74 206L74 74Z" id="c1g0ovdwGK"></path>
            </defs>
            <g>
              <g>
                <g>
                  <use xlink:href="#h78BYsXhGZ" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#aqWpmy35m" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#a27dmBsRH4" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
                <g>
                  <use xlink:href="#iU4acl8wI" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
                <g>
                  <use xlink:href="#a30utWt0RT" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
                <g>
                  <use xlink:href="#c1g0ovdwGK" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
              </g>
            </g>
          </svg>
        </i>
      </div>
      <div class="control-button arrange bring-forward" title="Bring Forward" @click="arrange(1)">
        <i>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 280 280" width="280" height="280">
            <defs>
              <path d="M9 83L197 83L197 271L9 271L9 83Z" id="abBBqMAMc"></path>
              <path d="M74 0L280 0L280 206L74 206L74 0Z" id="b31QZVZ81X"></path>
              <path d="M47 119L159 119L159 231L47 231L47 119Z" id="a1DlpEkgyF"></path>
              <path d="M83 9L271 9L271 197L83 197L83 9Z" id="a3RJPEfAiJ"></path>
            </defs>
            <g>
              <g>
                <g>
                  <use xlink:href="#abBBqMAMc" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#b31QZVZ81X" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
                <g>
                  <use xlink:href="#a1DlpEkgyF" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
                <g>
                  <use xlink:href="#a3RJPEfAiJ" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
              </g>
            </g>
          </svg>
        </i>
      </div>
      <div class="control-button arrange send-backward" title="Send Backward" @click="arrange(-1)">
        <i>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 280 280" width="280" height="280">
            <defs>
              <path d="M9 83L197 83L197 271L9 271L9 83Z" id="e6M5PLkh24"></path>
              <path d="M74 0L280 0L280 206L74 206L74 0Z" id="a7mchFZYJM"></path>
              <path d="M83 9L271 9L271 197L83 197L83 9Z" id="aenU3pKT"></path>
              <path d="M119 47L231 47L231 159L119 159L119 47Z" id="a1HxNRhVQX"></path>
            </defs>
            <g>
              <g>
                <g>
                  <use xlink:href="#e6M5PLkh24" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#a7mchFZYJM" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
                <g>
                  <use xlink:href="#aenU3pKT" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#a1HxNRhVQX" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
              </g>
            </g>
          </svg>
        </i>
      </div>
      <div class="control-button arrange send-to-back" title="Send to Back" @click="arrange(-Infinity)">
        <i>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="0 0 280 280" width="280" height="280">
            <defs>
              <path d="M0 0L132 0L132 132L0 132L0 0Z" id="bjdnDRQ28"></path>
              <path d="M148 148L280 148L280 280L148 280L148 148Z" id="a25AUP3Q2u"></path>
              <path d="M75 148L132 148L132 205L75 205L75 148Z" id="f101BR487d"></path>
              <path d="M148 75L205 75L205 132L148 132L148 75Z" id="d1ppiXfTIV"></path>
              <path d="M37.5 37.5L94.5 37.5L94.5 94.5L37.5 94.5L37.5 37.5Z" id="a1GiOpCaii"></path>
              <path d="M185.5 185.5L242.5 185.5L242.5 242.5L185.5 242.5L185.5 185.5Z" id="fWwReI7aa"></path>
            </defs>
            <g>
              <g>
                <g>
                  <use xlink:href="#bjdnDRQ28" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#a25AUP3Q2u" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#f101BR487d" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#d1ppiXfTIV" opacity="1" fill="#787878" fill-opacity="1" class="fillable"></use>
                </g>
                <g>
                  <use xlink:href="#a1GiOpCaii" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
                <g>
                  <use xlink:href="#fWwReI7aa" opacity="1" fill="#ffffff" fill-opacity="1"></use>
                </g>
              </g>
            </g>
          </svg>
        </i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransformForm',
  props: {
    node: Object,
    onTransform: Function,
    onArrange: Function,
  },
  methods: {
    transform(type, dir) {
      if (type === 'flip') {
        const { x: scaleX, y: scaleY } = this.node.scale();
        if (dir === 'h') {
          this.submit('scaleX', -(scaleX || 1));
        }
        if (dir === 'v') {
          this.submit('scaleY', -(scaleY || 1));
        }
      }
      if (type === 'align') {
        const { width, height } = this.node.parent.size();
        if (dir === 'h') {
          this.submit('x', ~~(width / 2));
        }
        if (dir === 'v') {
          this.submit('y', ~~(height / 2));
        }
      }
    },
    submit(...args) {
      if (typeof this.onTransform === 'function') {
        this.onTransform(...args);
      }
    },
    arrange(to) {
      if (typeof this.onArrange === 'function') {
        this.onArrange(to);
      }
    }
  }
};
</script>

<style type="text/css" lang="scss">
.controls-form {
  padding: 5px 0;
}

.buttons-row {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 36px;

  &.transformation {
  }

  &.arrangement {
    margin-top: 5px;

    .control-button:hover svg .fillable {
      fill: var(--c-primary);
    }
  }

  .control-button {
    cursor: pointer;
    height: 100%;
    flex: 1;
    position: relative;
    color: #98a0b1;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover svg {
      fill: var(--c-primary);
    }

    i {
      display: inline-flex;
      fill: currentColor;
      position: relative;
      pointer-events: none;

      svg {
        width: 1.5em;
        height: 1.5em;
      }
    }

    &:not(:last-child):after {
      content: "";
      top: 5px;
      right: 0;
      bottom: 5px;
      left: auto;
      position: absolute;
      width: 1px;
      background-color: #e3e4e8;
    }
  }
}
</style>
