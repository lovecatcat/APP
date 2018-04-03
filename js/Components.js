
const AppInput = {
  props: {
    label: String,
    right: Boolean,
    color: Boolean
  },
  template: `
  <div class="input-item">
    <label class="">{{label}}</label>
    <div class="input-wrap box-f-1">
        <slot name="input"></slot>
        <slot name="icon"></slot>
    		<slot name="button"></slot>
    </div>
	</div>
  `
}

const AppSelect = {
  props: {
    label: String,
    readonly: Boolean
  },
  template: `
	<div class="input-item ins-pd-r-0">
	   	<label class="">{{label}}</label>
	    <div class="input-wrap box-f-1 multi-btn">
	        <slot name="button"></slot>
	    </div>
	</div>
  `
}

const AppDropdown = {
  props: {
    label: String,
    up: {
      type: Boolean,
      default: true
    },
    isform: {
      type: Boolean,
      default: true
    },
    func: Function
  },
  template: `
  <div class="am-list" :class="{'am-list-6lb': isform, 'form': isform}">
    <div class="am-list-item dropdown" :class="{up:isup}">
      <div class="form-header fn-clear form-header__dropdown" @click="toggle" v-if="label">
        <span class="fn-left">{{label}}</span>
        <span class="arrow-icon" :class="{active:isup}"></span>
      </div>
      <div class="am-list-dropdown-main" v-else>
        <slot name="header"></slot>
      </div>
      <div class="am-list-dropdown-list">
        <slot></slot>
      </div>
    </div>
  </div>
  `,
  data () {
    return {
      isup: ''
    }
  },
  created () {
    this.isup = this.up
  },
  methods: {
    toggle () {
      this.isup = !this.isup
      this.func && this.func()
    }
  }
}

Vue.component('app-input', AppInput)
Vue.component('app-select', AppSelect)
Vue.component('app-dropdown', AppDropdown)
