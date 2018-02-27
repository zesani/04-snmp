<template>
  <div id="app">
    <div class="columns is-multiline is-mobile">
      <div class="column is-6">
        <line-chart :data="temp"/>
      </div>
       <div class="column is-6">
        <line-chart :data="cpu"/>
      </div>
      <div class="column is-6">
        <line-chart :data="memory"/>
      </div>
      <div class="column is-6">
        <line-chart :data="inB"/>
      </div>
      <div class="column is-6">
        <line-chart :data="out"/>
      </div>
    </div>
    <div class="columns is-multiline is-mobile">
      <div class="column is-2" style="border: 1px solid;"  v-for="int in interfaces" :key="int.index">
        <interface @change-interface="chageInterface" :data="int"/>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
/* global io */
import moment from 'moment'
import LineChart from './components/LineChart.vue'
import Interface from './components/Interface'
export default {
  name: 'App',
  components: {
    LineChart,
    Interface
  },
  data () {
    return {
      socket: '',
      devices: [],
      interfaces: []
    }
  },
  mounted () {
    this.socket = io.connect()
    this.socket.on('init device', (data) => {
      this.devices = data
    })
    this.socket.on('update device', (data) => {
      this.devices.push(data)
    })
    this.socket.on('all interface', (data) => {
      this.interfaces = data
    })
    this.socket.on('update link status', ({index, linkStatus}) => {
      let int = this.interfaces.find(int => int.index.toString() === index.toString())
      if (int) {
        int.linkStatus = linkStatus
        this.linkStatus(int)
      }
    })
  },
  methods: {
    chageInterface (index, value) {
      this.socket.emit('change interface', {index, value})
    },
    linkStatus (int) {
      const message = `Link ${int.description}  status ${int.linkStatus === 1 ? 'UP' : 'DOWN'}`
      this.$snackbar.open({
        message,
        type: 'is-warning',
        position: 'is-top',
        queue: false,
        actionText: null
      })
    }
  },
  computed: {
    labels () {
      return this.devices.map(device => {
        return moment(device.time).format('HH:mm')
      })
    },
    temp () {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'temp C',
            borderColor: '#f87979',
            data: this.devices.map(device => device.temp)
          }
        ]
      }
    },
    cpu () {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'cpu %',
            borderColor: '#f87979',
            data: this.devices.map(device => device.cpu)
          }
        ]
      }
    },
    memory () {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'memory %',
            borderColor: '#f87979',
            data: this.devices.map(device => device.memory)
          }
        ]
      }
    },
    inB () {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'in %',
            borderColor: '#f87979',
            data: this.devices.map(device => device.in)
          }
        ]
      }
    },
    out () {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'out %',
            borderColor: '#f87979',
            data: this.devices.map(device => device.out)
          }
        ]
      }
    }
  }
}
</script>

<style>
</style>
<style lang="scss">
// @import "~bulma/sass/utilities/_all";

// // Set your colors
// $primary: #F4F;
// $primary-invert: findColorInvert($primary);
// $twitter: #4099FF;
// $twitter-invert: findColorInvert($twitter);

// // Setup $colors to use as bulma classes (e.g. 'is-twitter')
// $colors: (
//     "white": ($white, $black),
//     "black": ($black, $white),
//     "light": ($light, $light-invert),
//     "dark": ($dark, $dark-invert),
//     "primary": ($primary, $primary-invert),
//     "info": ($info, $info-invert),
//     "success": ($success, $success-invert),
//     "warning": ($warning, $warning-invert),
//     "danger": ($danger, $danger-invert),
//     "twitter": ($twitter, $twitter-invert)
// );

// // Links
// $link: $primary;
// $link-invert: $primary-invert;
// $link-focus-border: $primary;

// // Import Bulma and Buefy styles
// @import "~bulma";
// @import "~buefy/src/scss/buefy";
</style>
