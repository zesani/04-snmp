<template>
  <div>
      <!-- <a @click="$emit('change-interface', data.index, data.status === 1 ? 2: 1)"> {{linkStatus}}</a> -->
      <b-tooltip :label="data.description"
            position="is-top">
            <button style="width: 100px;" :class="`button ${status}`" @click="$emit('change-interface', data.index, data.status === 1 ? 2: 1)">
              {{linkStatus}}
            </button>
        </b-tooltip>
  </div>
</template>
<script>
export default {
  props: ['data'],
  computed: {
    status () {
      if (this.data.status === 1) return 'is-success'
      return 'is-danger'
    },
    linkStatus () {
      if (this.data.linkStatus === 1) return 'UP'
      return 'DOWN'
    }
  }
}
</script>
