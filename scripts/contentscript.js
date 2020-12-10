'use strict';
let width, height, div;
let ads = false, shared_post = false, store = false, contains_keywords = false, contains_name = false,
  array_keywords = [], array_name = [];
let class_comment_text = "kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x c1et5uql";
let class_comment_image = "j83agx80 bvz0fpym c1et5uql";
let class_div_comment = "g3eujd1d ni8dbmo4 stjgntxs";

function removeAscent(str) {
  if (str === null || str === undefined) return str;
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str;
}

(function ($) {
  $.fn.regex = function (keywords, fn, fn_a) {
    var fn = fn || $.fn.text;
    let pattern = new RegExp(keywords, "g");
    return this.filter(function () {
      return pattern.test(removeAscent(fn.apply($(this), fn_a)));
    });
  };
})(jQuery);
chrome.storage.sync.get(["opts","keywords","name"], ({opts, keywords,name}) => {
  if(opts.ads){
    ads = true;
  }
  if (opts.shared_post) {
    shared_post = true;
  }
  if (opts.store) {
    store = true;
  }
  if (opts.contains_keywords) {
    contains_keywords = true;
    array_keywords = keywords;
  }
  if (opts.contains_name) {
    contains_name = true;
    array_name = name;
  }
});
(function (chrome) {
  jQuery(document).ready(function ($) {
    if (store) {
      hideStoreButton();
    }

    $(window).scroll(function () {
      let i;
      if (ads) {
        // bài quảng cáo
        div = $('[aria-label="Sponsored"]').closest(`div[data-pagelet^="FeedUnit"]`).first();
        if (div.length === 0) {
          div = $('[aria-label="Được tài trợ"]').closest(`div[data-pagelet^="FeedUnit"]`).first();
        }
        if (div.length !== 0) {
          executeDiv(div, chrome.i18n.getMessage('ads'));
        }
      }
      if (shared_post) {
        // bài chia sẻ
        div = $('[data-testid="Keycommand_wrapper_feed_attached_story"]').closest(`div[data-pagelet^="FeedUnit"]`).first();
        executeDiv(div, chrome.i18n.getMessage('shared_post'));
      }
      if (contains_name) {
        // trang hoặc nhóm chứa tên
        for (i = 0; i < array_name.length; i++) {
          div = getDivGroup(array_name[i]);
          if (div.length === 0) {
            div = getDivPage(array_name[i]);
          }
          if (div.length === 0) {
            executeDiv(div);
          }
        }
      }
      if (contains_keywords) {
        // bài hoặc bình luận chứa từ khoá
        for (i = 0; i < array_keywords.length; i++) {
          div = getDivPost(array_keywords[i]);
          if (div.length === 0) {
            getDivComment(array_keywords[i]);
          }
        }
      }
    });
  });
})(chrome);


function getDivComment(keyword) {
  $(`div[class="${class_comment_text}"]:not('.ex-replaced')`)
    .regex(keyword)
    .html(`
           ${chrome.i18n.getMessage('comment')} ${chrome.i18n.getMessage('contains_keywords').toLowerCase()} ${chrome.i18n.getMessage('notification')}
           <a href="https://facebook.com/gaixinhchonloc">${chrome.i18n.getMessage('appName')}</a>
           .
        `)
    // thêm class là đã loại trừ
    .addClass('ex-replaced')
    // tìm đến div tổng
    .closest(`div[class='${class_div_comment}']`)
    // tìm đến div con có hình ảnh rồi loại bỏ nó
    .find(`div[class='${class_comment_image}'`).remove();
}

function getDivPost(keyword) {
  let class_post_text = ["ecm0bbzt hv4rvrfc ihqw7lf3 dati1w0a", "dati1w0a ihqw7lf3 hv4rvrfc ecm0bbzt"];
  for (let i = 0; i < class_post_text.length; i++) {
    div = $(`div[data-pagelet^="FeedUnit"]`).has(`div[class="${class_post_text[i]}"]`).regex(keyword).first();
    if (div.length !== 0) {
      executeDiv(div, chrome.i18n.getMessage('post'));
      break;
    }
  }
  return div;
}

function getDivGroup(name) {
  let class_div_name = ["jq4qci2q ekzkrbhg a3bd9o3v"];
  for (let i = 0; i < class_div_name.length; i++) {
    div = $(`div[data-pagelet^="FeedUnit"]`).has(`div[class="${class_div_name[i]}"]`).regex(name).first();
    if (div.length !== 0) {
      executeDiv(div, chrome.i18n.getMessage('group'));
      break;
    }
  }
  return div;
}

function getDivPage(name) {
  let class_div_name = ["jq4qci2q ekzkrbhg a3bd9o3v"];
  for (var i = 0; i < class_div_name.length; i++) {
    let div = $(`div[data-pagelet^="FeedUnit"]`).has(`strong`).regex(name).first();
    if (div.length !== 0) {
      executeDiv(div, chrome.i18n.getMessage('page'));
      break;
    }
  }
  return div;
}

function executeDiv(this_div, type) {
  if (this_div.length !== 0) {
    this_div.remove();
    chrome.runtime.sendMessage({updateBadge: ""});
  }
}

function hideStoreButton() {
  // bỏ nút quảng cáo
  $('a[href*="marketplace"]').closest(`li`).hide();
}
