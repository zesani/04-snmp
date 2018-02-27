<template>
  <div id="app">
     <div class="columns is-multiline is-mobile">
      <div class="column is-10 is-offset-1">
        <div class="columns is-multiline is-mobile">
          <div class="column is-5">
            <line-chart :data="temp"/>
          </div>
          <!-- <div class="column is-4">
            <line-chart :data="cpu"/>
          </div>
          <div class="column is-4">
            <line-chart :data="memory"/>
          </div>
          <div class="column is-4">
            <line-chart :data="inB"/>
          </div>
          <div class="column is-4">
            <line-chart :data="out"/>
          </div> -->
        </div>
      </div>
      <div class="column is-10 is-offset-1">
            <div class="columns is-multiline is-mobile">
            <div class="column is-1" :style="`border:1px solid #fff; text-align: center;${parseInt(int.index) < 14000 ? 'background-color: gray;' : 'background-color: yellow;'}`" v-if="int.type === 6" v-for="int in interfaces" :key="int.index">
              <interface @change-interface="chageInterface" :data="int"/>
            </div>
          </div>
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
      chart: 'cpu',
      devices: [],
      interfaces: []
    }
  },
  mounted () {
    this.socket = io.connect()
    this.socket.on('init device', (data) => {
      console.log('1', data)
      this.devices = data
    })
    this.socket.on('update device', (data) => {
      console.log('2', data)
      this.devices.push(data)
    })
    this.socket.on('all interface', (data) => {
      console.log('3', data)
      this.interfaces = data
    })
    this.socket.on('update interface', (data) => {
      console.log('3', data)
      let int = this.interfaces.find(int => int.index === data.index)
      if (int) {
        int.status = data.status
      }
    })
    this.socket.on('update interface link status', (data) => {
      console.log('4', data)
      let int = this.interfaces.find(int => int.index === data.index.toString())
      if (int) {
        int.linkStatus = data.linkStatus
        this.linkStatus(int)
      }
    })
  },
  methods: {
    chageInterface (index, value) {
      this.socket.emit('change interface', {index, value})
    },
    linkStatus(int) {
      const message = `LINK ${int.description}  status ${int.linkStatus === 1 ? 'UP' : 'DOWN'}`
      this.$snackbar.open({
        message,
        type: 'is-warning',
        position: 'is-top',
        actionText: null,
        queue: false
      })
    }
  },
  computed: {
    labels () {
      return this.devices.map(device => {
        return moment(device.time).format('HH:mm')
      }).slice(0, 10)
    },
    temp () {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'temp C',
            borderColor: '#f87979',
            data: this.devices.map(device => device.temp).slice(0, 20),
            fill: false,
            lineWidth:1,
            borderDash: [5, 10]
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
            data: this.devices.map(device => device.cpu),
            fill: false
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
            data: this.devices.map(device => device.memory),
            fill: false
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
            data: this.devices.map(device => device.in),
            fill: false
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
            data: this.devices.map(device => device.out),
            fill: false
          }
        ]
      }
    }
  }
}
</script>

<style>
.a {
  text-align: center;
}
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
