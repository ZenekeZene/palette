<template>
	<div class="bonus" @click="activateBonus">
		<button class="bonus__button">
			<span class="bonus__quantity">x{{ bonus }}</span>
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
				console.log('Bonus ready...')
				this.bonusCheck = true;
			} else if (this.bonusCheck) {
				console.log('Bonus got it!!!!');
				this.incrementBonus();
				this.bonusCheck = false;
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

