import config from '../config';
const Utils = {
	install(Vue, options) {
		Vue.prototype.openLink = (theUrl) => {
			window.open(theUrl, '_blank', 'location=yes');
		};
		
		Vue.prototype.mountTweet = (tweet) => `${config.tweet.pref}${tweet}${config.tweet.suf}`;
	},
};

export default Utils;
