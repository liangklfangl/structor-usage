var params = {
  left: 0,
  top: 0,
  currentX: 0,
  currentY: 0,
  flag: false
};

var getCss = function(o, key) {
  return o.currentStyle
    ? o.currentStyle[key]
    : document.defaultView.getComputedStyle(o, false)[key];
};

/**
 * 全部是那个rnd元素
 */
window.startDrag = function(bar, target, callback) {
  if (getCss(target, "left") !== "auto") {
    params.left = getCss(target, "left");
  }
  if (getCss(target, "top") !== "auto") {
    params.top = getCss(target, "top");
  }

  /**
   * 获取元素的clientX/clientY
   */
  bar.onmousedown = function(event) {
    params.flag = true;
    if (!event) {
      event = window.event;
      bar.onselectstart = function() {
        return false;
      };
    }
    var e = event;
    // params.currentX = e.clientX;
	// params.currentY = e.clientY;
	console.log('e===',e);
    params.currentX = e.pageX;
    params.currentY = e.pageY;
  };

  /**
   *  document.onmouseup =>  bar.onmouseup
   */
  bar.onmouseup = function() {
    params.flag = false;
    if (getCss(target, "left") !== "auto") {
      params.left = getCss(target, "left");
    }
    if (getCss(target, "top") !== "auto") {
      params.top = getCss(target, "top");
    }
  };

  /**
   * document.onmousemove =>  bar.onmousemove
   */
  bar.onmousemove = function(event) {
    var e = event ? event : window.event;
    if (params.flag) {
      //   var nowX = e.clientX,
      //     nowY = e.clientY;
      var nowX = e.pageX,
        nowY = e.pageY;
      var disX = nowX - params.currentX,
        disY = nowY - params.currentY;
      target.style.left = parseInt(params.left) + disX + "px";
      target.style.top = parseInt(params.top) + disY + "px";
      if (typeof callback == "function") {
        callback(
          (parseInt(params.left) || 0) + disX,
          (parseInt(params.top) || 0) + disY
        );
      }
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    }
  };
};
