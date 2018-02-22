<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
/* global io */
export default {
  name: 'App',
  data () {
    return {
      socket: ''
    }
  },
  mounted () {
    this.socket = io.connect()
    this.socket.on('init device', (data) => {
      console.log('1', data)
    })
    this.socket.on('update device', (data) => {
      console.log('2', data)
    })
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
