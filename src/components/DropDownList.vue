<template>
  <div class="input-group" style="position: relative;">
    <span class="input-label">{{ title }}</span>
    <div class="dd-wrapper">
      <div class="input-value" @click="toggle">
        <span v-html="selectedTitle" />
        <i>
          <svg width="32" height="32" viewBox="0 0 1024 1024" fill="#96C22E">
            <path v-if="opened" d="M316.16 657.493l195.84-195.413 195.84 195.413 60.16-60.16-256-256-256 256z"/>
            <path v-else d="M316.16 366.507l195.84 195.413 195.84-195.413 60.16 60.16-256 256-256-256 60.16-60.16z"/>
          </svg>
        </i>
      </div>
      <div class="variants-list" :class="{ opened }">
        <div v-for="(item, i) in list" :key="i" :class="{ selected: item.value === value }" class="list-item" @click="emit(item.value)" v-html="item.text"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropDownList',
  props: {
    value: [String, Number],
    items: {
      type: Array,
      default: () => [],
    },
    placeholder: String,
    title: {
      type: String,
      default: () => 'Select',
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    emit(value) {
      this.$emit('change', value);
      this.opened = false;
    },
    toggle() {
      this.opened = !this.opened;
    }
  },
  computed: {
    selectedTitle() {
      return this.map.get(this.selected || this.value) || null;
    },
    list() {
      return [...this.valuesSet.keys()].map(value => ({ value, text: this.map.get(value) }));
    }
  },
  data() {
    return {
      map: new Map(),
      opened: false,
      valuesSet: new Set(),
    };
  },
  created() {
    this.map = new Map(this.items.map(({ value, text }) => {
      this.valuesSet.add(value);
      return [value, text];
    }));
  }
};
</script>

<style type="text/css" lang="scss" scoped>
.dd-wrapper {
  position: relative;
  user-select: none;

  .input-value {
    width: 100%;
    border: 1px solid var(--c-primary);
    display: inline-flex;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    align-items: center;
    height: 32px;
    padding-left: 10px;
    cursor: pointer;

    span {
      width: 100%;
      flex-grow: 2;
    }

    i.icon {
      width: 32px;
    }
  }

  .variants-list {
    display: none;
    position: absolute;
    top: calc(100% + 5px);
    max-height: 200px;
    width: 100%;
    overflow-y: auto;
    border: 1px solid var(--c-primary);
    border-radius: 4px;
    background: white;
    z-index: 5;

    &.opened {
      display: flex;
      flex-direction: column;
    }

    .list-item {
      padding: 12px;
      cursor: pointer;

      &.selected {
        background-color: #96C22E;
        color: white;
      }

      &:hover {
        background-color: #F4FFC2;
        color: #787878;
      }
    }
  }
}
</style>
