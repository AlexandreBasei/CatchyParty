<template>
  <div class="profile-picture" :style="{ width: width + 'px' }">
    <img :src="bodySrc" class="avatar-part"/>
    <img :src="eyesSrc" class="avatar-part"/>
    <img :src="mouthSrc" class="avatar-part"/>
  </div>
</template>

<script>
export default {
  props: {
    bodyIndex: Number,
    eyesIndex: Number,
    mouthIndex: Number,
    width: Number,
  },
  computed: {
    bodySrc() {
      return require(`@/assets/svg/avatars/bodies/body${this.bodyIndex}.svg`);
    },
    eyesSrc() {
      return require(`@/assets/svg/avatars/eyes/eyes${this.eyesIndex}.svg`);
    },
    mouthSrc() {
      return require(`@/assets/svg/avatars/mouths/mouth${this.mouthIndex}.svg`);
    }
  }
};
</script>

<style lang="css" scoped>
    @import "./profilepicture.css"
</style>
