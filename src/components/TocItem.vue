<template>
  <div class="toc-item-wrapper">
    <a
      :href="'#' + item.id"
      class="toc-item"
      :class="{
        'active': activeHeading === item.id,
        [`level-${item.level}`]: true
      }"
      @click.prevent="$emit('click', $event, item.id)"
    >
      {{ item.text }}
    </a>
    <div v-if="item.children.length > 0" class="toc-children">
      <TocItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :active-heading="activeHeading"
        @click="(e, id) => $emit('click', e, id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  level: number
  children: TocItem[]
}

defineProps<{
  item: TocItem
  activeHeading: string
}>()

defineEmits<{
  (e: 'click', event: MouseEvent, id: string): void
}>()
</script>

<style scoped>
.toc-item-wrapper {
  margin-bottom: 0.25rem;
}

.toc-children {
  margin-left: 1rem;
}

.toc-item {
  display: block;
  padding: 0.25rem 0;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.toc-item:hover {
  color: var(--primary-color);
}

.toc-item.active {
  color: var(--primary-color);
  font-weight: 500;
}

.level-1 { margin-left: 0; }
.level-2 { margin-left: 1rem; }
.level-3 { margin-left: 2rem; }
.level-4 { margin-left: 3rem; }
.level-5 { margin-left: 4rem; }
.level-6 { margin-left: 5rem; }
</style> 