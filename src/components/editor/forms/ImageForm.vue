<template>
  <div class="image-form form-wrapper">
    <div class="input-group">
      <span class="input-label">Filters</span>
      <div class="image-filters">
        <template v-for="(item, i) in filtersList">
          <div :key="i" @click="setFilter(item.id)" class="filter-tile" :class="{ active: filter === item.id }">
            <div class="image-wrapper">
              <div class="image" :class="item.id" />
            </div>
            <span>{{ item.title }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageForm',
  props: {
    attrs: Object,
    onInput: Function,
    filter: {
      type: String,
      default: () => 'none',
    },
  },
  computed: {
    filtersList() {
      return [
        { title: 'Original', id: 'none' },
        { title: 'Invert', id: 'invert' },
        { title: 'Sepia', id: 'sepia' },
        // { title: 'Solarize', id: 'solarize' },
        { title: 'Grayscale', id: 'grayscale' },
      ];
    }
  },
  methods: {
    setFilter(id) {
      this.submit('__filter', id);
    },
    submit(...args) {
      if (typeof this.onInput === 'function') {
        this.onInput(...args);
      }
    },
  }
};
</script>

<style type="text/css" lang="scss">
.image-form {
  .image-filters {
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(70px,1fr));
    grid-auto-rows: minmax(auto,90px);
    grid-column-gap: 8px;
    grid-row-gap: 8px;

    .filter-tile {
      cursor: pointer;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .image-wrapper {
        width: 80px;
        height: 60px;
        border-radius: 4px;
        padding: 1px;
        display: inline-flex;
        box-sizing: border-box;

        .image {
          width: 100%;
          background: url(/landscape_4x3.jpg) center;
          background-size: cover;

          &.invert {
            filter: invert(1);
          }
          &.sepia {
            filter: sepia(1);
          }
          &.grayscale {
            filter: grayscale(1);
          }
        }
      }
      &.active .image-wrapper {
        border: 2px solid var(--c-primary);
      }

      span {
        margin-top: 5px;
      }
    }
  }
}
</style>
