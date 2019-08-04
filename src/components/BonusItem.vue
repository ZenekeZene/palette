<template>
	<div class="bonus" @click="activateBonus">
		<button class="bonus__button">
			<span class="bonus__quantity">{{ bonus }}</span>
		</button>
	</div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import config from '../config';

export default {
	name: 'BonusItem',
	computed: {
		...mapState([
			'bonus'
		]),
	},
	props: {
		triggerCheckBonus: {
			type: Number,
			default: 0,
		},
		indexOfDropzoneToCheck: {
			type: Number,
			default: 0,
		},
	},
	watch: {
		triggerCheckBonus(val) {
			this.checkIsBonus();
		},
	},
	data() {
		return {
			timerId: null,
			bonusCheck: false,
		};
	},
	methods: {
		...mapMutations([
			'incrementBonus',
			'decreaseBonus',
		]),
		checkIsBonus() {
			clearTimeout(this.timerId);
			this.timerId = setTimeout(() => {
				this.bonusCheck = false;
			}, config.intervalBonus);

			if (this.bonusCheck === false) {
				this.bonusCheck = true;
			} else if (this.bonusCheck) {
				this.incrementBonus();
				this.bonusCheck = false;
				this.$emit('bonusGot', true);
			}
		},
		activateBonus() {
			if (this.bonus > 0) {
				this.decreaseBonus();
				this.$emit('bonusUsed');
			}
		}
	},
};
</script>

