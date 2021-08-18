<template>
  <div class="scroll-number">
    <div class="box-items">
      <template v-for="index of numberLength">
        <li v-if="formatCount.charAt(index - 1) !== ',' && formatCount.charAt(index - 1) !== '.'" :key="index" class="number-item" :style="sizeStyle">
          <span>
            <i ref="numberItem" class="item">0123456789</i>
          </span>
        </li>
        <li v-else :key="index" :style="splitTyle">
          <span>{{ formatCount.charAt(index - 1) }}</span>
        </li>
      </template>
    </div>
    <button @click="randomNum">随机改变数字</button>
  </div>
</template>

<script>
export default {
  name: "ScrollNumber",
  components: {},
  props: {
    // count: {
    //   type: [Number, String],
    //   default: 0,
    // },
    // size: {
    //   type: [Number, String],
    //   default: 1,
    // },
  },
  watch: {
    formatCount: function() {
      // 让先出现0，再渲染数字
      setTimeout(() => {
        this.setNumberTransform();
      }, 0);
    },
  },
  data() {
    return {
      count: 9999,
      size: 2,
    };
  },
  computed: {
    formatCount() {
      const intPartFormat = this.count.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
      return intPartFormat;
    },
    numberLength() {
      return this.formatCount.toString().length;
    },
    sizeStyle() {
      return {
        width: this.size - 0.44 + "vw",
        height: this.size + "vw",
        lineHeight: this.size + "vw",
        fontSize: this.size + "vw",
      };
    },
    splitTyle() {
      return {
        lineHeight: this.size + "vw",
        fontSize: this.size + "vw",
        fontWeight: "bold",
        color: "#fece50",
      };
    },
  },
  methods: {
    setNumberTransform() {
      this.$nextTick(() => {
        const numberElements = this.$refs.numberItem;
        for (var index = 0; index < numberElements.length; index++) {
          const elem = numberElements[index];
          elem.style.transform = "translate(-50%, -" + String(this.count).charAt(index) * 10 + "%)";
        }
      });
    },
    randomNum() {
      this.count = Number.parseInt(Math.random() * Math.pow(10, Number.parseInt(Math.random() * 10)));
    },
  },
  mounted() {
    if (this.count > 0) {
      setTimeout(() => {
        this.setNumberTransform();
      }, 0);
    }
  },
};
</script>

<style scoped>
@font-face {
  font-family: "Digital-1";
  src: url("/@/assets/digital.ttf");
  font-weight: normal;
  font-style: normal;
}
.scroll-number {
  padding: 30px;
}
.box-items {
  display: flex;
  justify-content: center;
  width: auto;
  font-family: Digital-1;
  position: relative;
  text-align: center;
  list-style: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.box-items .number-item {
  font-weight: bold;
  color: #fece50;
}
.box-items .number-item span {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  writing-mode: vertical-rl;
  text-orientation: upright;
  overflow: hidden;
}
.box-items .number-item span i {
  font-style: normal;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  transition: transform 1s ease-in-out;
}
</style>
