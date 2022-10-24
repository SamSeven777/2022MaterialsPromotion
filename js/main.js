(function(_, d, q, t){
	'use strict';
	var startSpace = 1000;
	var animateSpace = 2000;
	var pictureSpace = 1750;
	var buttonSpace = 1750;
	var w = 640, h = 1240, aspectRatio = w / h;
	
	var JPG_NUM = 26;
	var PNG_NUM = 38;
	var JPG_URL = "img/{0}.jpg";
	var PNG_URL = "img/{0}.png";

	function $(sel) {
		return d.querySelector(sel);
	}
	
	function r(str) {
		return q.getResult(str);
	}
	
	function remove(element) {
		element.parentNode.removeChild(element);
	}
	
	function subst(str) {
		for (var i = 1; i < arguments.length; i++) {
			str = str.replace(new RegExp('\\{' + (i - 1).toString() + '\\}', 'g'), arguments[i]);
		}
		return str;
	}
	
	function adjustPosition() {
		var root = $("#root");
		var sw = document.body.clientWidth, sh = document.body.clientHeight, w = sw, h = sh;
		if (w / h < aspectRatio) {
			h = w / aspectRatio;
		} else {
			w = h * aspectRatio;
		}
		root.style.width = w + "px";
		root.style.height = h + "px";
		root.style.top = (sh - h) / 2 + "px";
		root.style.left = (sw - w) / 2 + "px";
	}
	
	var res = [];
	
	for (var i = 0; i <= JPG_NUM; i++) {
		var idx = i.toString().padStart(2, '0')
		res.push({src: subst("img/{0}.jpg", idx), id: "j" + idx, type: t.IMAGE, preferXHR: false});
	}
	for (var i = 0; i <= PNG_NUM; i++) {
		var idx = i.toString().padStart(2, '0')
		res.push({src: subst("img/{0}.png", idx), id: "p" + idx, type: t.IMAGE, preferXHR: false});
	}
	
	var book = [[[Story.jmp, 27]], [[Story.clbg], [Story.ed, 'j05']], [[Story.clbg], [Story.ed, 'j06']], [[Story.clbg], [Story.bg, 'j04'], [Story.img, 'p04', 0, 313], [Story.choice, ['p05', 52, 645, 1], ['p06', 372, 645, 2]]], [[Story.clbg], [Story.ed, 'j07']], [[Story.clbg], [Story.bg, 'j03'], [Story.img, 'p03', 0, 210], [Story.choice, ['p07', 52, 812, 3], ['p08', 372, 812, 4]]], [[Story.clbg], [Story.ed, 'j10']], [[Story.clbg], [Story.ed, 'j11']], [[Story.clbg], [Story.bg, 'j09'], [Story.img, 'p11', 0, 145], [Story.choice, ['p12', 96, 917, 6], ['p13', 416, 917, 7]]], [[Story.clbg], [Story.ed, 'j12']], [[Story.clbg], [Story.bg, 'j08'], [Story.img, 'p10', 0, 212], [Story.choice, ['p14', 52, 809, 8], ['p15', 372, 809, 9]]], [[Story.clbg], [Story.bg, 'j02'], [Story.img, 'p02', 0, 268], [Story.choice, ['p09', 67, 718, 5], ['p16', 387, 718, 10]]], [[Story.clbg], [Story.ed, 'j16']], [[Story.clbg], [Story.ed, 'j17']], [[Story.clbg], [Story.bg, 'j15'], [Story.img, 'p20', 0, 232], [Story.choice, ['p21', 52, 777, 12], ['p22', 372, 777, 13]]], [[Story.clbg], [Story.ed, 'j18']], [[Story.clbg], [Story.bg, 'j14'], [Story.img, 'p19', 0, 219], [Story.choice, ['p23', 96, 798, 14], ['p24', 416, 798, 15]]], [[Story.clbg], [Story.ed, 'j20']], [[Story.clbg], [Story.ed, 'j21']], [[Story.clbg], [Story.bg, 'j19'], [Story.img, 'p26', 0, 216], [Story.choice, ['p27', 52, 804, 17], ['p28', 372, 804, 18]]], [[Story.clbg], [Story.bg, 'j13'], [Story.img, 'p18', 0, 293], [Story.choice, ['p25', 52, 678, 16], ['p29', 372, 678, 19]]], [[Story.clbg], [Story.bg, 'j01'], [Story.img, 'p01', 0, 226], [Story.choice, ['p17', 52, 788, 11], ['p30', 372, 788, 20]]], [[Story.clbg], [Story.ed, 'j23']], [[Story.clbg], [Story.ed, 'j25']], [[Story.clbg], [Story.ed, 'j26']], [[Story.clbg], [Story.bg, 'j24'], [Story.img, 'p34', 0, 310], [Story.choice, ['p35', 52, 651, 23], ['p36', 372, 651, 24]]], [[Story.clbg], [Story.bg, 'j22'], [Story.img, 'p32', 0, 222], [Story.choice, ['p33', 52, 793, 22], ['p37', 372, 793, 25]]], [[Story.bg, 'j00'], [Story.img, 'p00', 0, 137], [Story.choice, ['p31', 14, 931, 21], ['p38', 334, 931, 26]]]];
	
	_.addEventListener("load", function () {
		adjustPosition();
		
		q.on("progress", function (e) {
			var percent = Math.floor(e.progress * 100) + "%"
			$("#percent").textContent = percent;
			$("#progress-bar").style.width = percent;
		});
		
		q.on("complete", function () {
			$("#percent").textContent = "Loaded!";
			$("#progress-bar").style.width = "100%";
			
			var start = $("#start");
			start.style.visibility = "visible";
			var startTip = $("#click-to-start");
			startTip.style.visibility = "visible";
			
			fadeIn(startTip, startSpace).setData(start).then(function(o) {
				o.data.onclick = function () {
					this.onclick = null;
					fadeOutAndDelete($("#progress-container"), startSpace);
					fadeOutAndDelete(this, startSpace).then(function() {
						new Story(book, w, h, {trans: fadeIn, transArg: [animateSpace]}).start($("#root"));
					});
				};
			});
			
		});
		
		q.loadManifest(res);
	});
	
	_.addEventListener("resize", adjustPosition);
	
	_.resource = q;
})(window, document, new createjs.LoadQueue(), createjs.Types);