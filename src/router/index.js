import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
import Game from "../views/Game.vue";
import Control from '../views/Control.vue';
import Final from '../views/Final.vue';
import Credits from "../views/Credits.vue";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/home',
			name: 'home',
			component: Home,
		},
		{
			path: '/game',
			name: 'game',
			component: Game,
		},
		{
			path: '/control',
			name: 'control',
			component: Control,
		},
		{
			path: '/final',
			name: 'final',
			component: Final,
		},
		{
			path: '/credits',
			name: 'credits',
			component: Credits,
		},
	],
});
