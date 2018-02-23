<script>

import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: ['data'],
  mounted () {
    // Overwriting base render method with actual data.
    this.renderChart(this.data)
  },
  watch: {
    data () {
      this.renderChart(this.data)
    }
  }
}
</script>
