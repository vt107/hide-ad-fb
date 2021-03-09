'use strict';
let height = 0;

(function (chrome) {
  jQuery(document).ready(function ($) {
    $(window).scroll(function () {
      let _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
      if (_docHeight === height) return;
      height = _docHeight;

      let totalAdsElms = $('span:contains("Send Message")');
      if (!totalAdsElms.length) return;

      for (let i = 0; i < totalAdsElms.length; i += 2) {
        $(totalAdsElms[i]).closest(`div[data-pagelet^="FeedUnit"]`).first().remove();
        console.log('Ads removed!')
      }
    });
  });
})(chrome);
