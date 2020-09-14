function huiPlayer(icfg){
    this.ver = "v0.0.1"
    console.log("%c huiPlayer " + this.ver + " " + "GitHub: https://github.com/KLXLjun/hyiplayer ", 'background: #fadfa3; padding:5px 0;')

    this.svgimage = {
        pause: 'M14,19H18V5H14M6,19H10V5H6V19Z',
        play: 'M8,5.14V19.14L19,12.14L8,5.14Z',
        fullscreen: 'M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z',
        exit_fullscreen: 'M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z',
        volume: 'M3 9V15H7L12 20V4L7 9H3M16 15H14V9H16V15M20 19H18V5H20V19Z',
        off_volume: 'M5.64,3.64L21.36,19.36L19.95,20.78L16,16.83V20L11,15H7V9H8.17L4.22,5.05L5.64,3.64M16,4V11.17L12.41,7.58L16,4Z'
    }

    this.config = {
        defVolume : 0.8
    }

    this.debuginfos = {
        lastvdecode: 0,
		lastadecode: 0,
        lastdec: 0,
        tsec:0
    }

    this.containers = icfg.container;
    //this.v_n = document.createElement("video");
    //this.v_n.id = "hyiplayer_video";
    this.v_n = icfg.videoNode;

    this.isReady = false;

    this.kRunTimeIn;
    this.kRunTimeOut;

    this.frame_count;

    if(typeof huiPlayer.initialized == 'undefined'){
        huiPlayer.prototype.Init = () =>{
            if(this.isReady) return;
            this.VEventListeners();

            this.frame_count = document.querySelectorAll('.hyiplayer-debug-info-panel .hyiplayer-debug-info-panel-item')
            
            //this.containers.appendChild(this.v_n)

            document.getElementsByClassName('hyiplayer-controls-time-total')[0].addEventListener('mouseup',(ew) => {
                let x = document.getElementsByClassName('hyiplayer-controls-time-total')[0]
                let pos = this.findPos(x);
                let diffy = ew.pageX - pos.x;
                let b = diffy / (x.style.width || x.clientWidth || x.offsetWidth || x.scrollWidth);
                this.v_n.currentTime = b * this.v_n.duration;

                this.displayText("更改播放位置",this.secondToDate(b * this.v_n.duration) + "/" + this.secondToDate(this.v_n.duration));
            })

            this.isReady = true;
        }

        huiPlayer.prototype.Play = () => {
            if(this.v_n.paused){
                let x = document.getElementsByClassName('hyiplayer-controls-play')[0].getElementsByTagName('svg')[0].getElementsByTagName('path')[0];
                x.setAttribute('d',this.svgimage.pause)
				this.v_n.play();
			}
			else{
                let x = document.getElementsByClassName('hyiplayer-controls-play')[0].getElementsByTagName('svg')[0].getElementsByTagName('path')[0];
                x.setAttribute('d',this.svgimage.play)
				this.v_n.pause();
			}
			return false;
        }

        huiPlayer.prototype.TimeUp = () => {
            let o = this.v_n.buffered;//.length - 1;
            let s = this.v_n.duration;
            let c = this.v_n.currentTime;

            for (var i = 0; i < o.length; i++) {
                // 寻找当前时间之后最近的点
                if (o.start(o.length - 1 - i) < c) {
                    let bufferedLength = (o.end(o.length - 1 - i) / s) * 100 + "%";
                    document.getElementsByClassName('hyiplayer-controls-time-buffer')[0].style.width = bufferedLength
                    break;
                }
            }
            document.getElementsByClassName('hyiplayer-controls-time-current')[0].style.width = (c / s) * 100 + "%"

            let p = document.querySelectorAll('.hyiplayer-controls-button-time-display span');
            p[0].innerText = this.secondToDate(c);
            p[1].innerText = this.secondToDate(s);
        }

        huiPlayer.prototype.VEventListeners = function(){
            var thiss = this;

            this.v_n.addEventListener('click',function(){ thiss.Play(); return false; });
            this.v_n.addEventListener('mousemove',function(evt){
                let e = window.event || evt;
                e.path.forEach(element => {
                    if(element.id == thiss.v_id){

                    }
                });
            });
            this.v_n.addEventListener('timeupdate',function(){ thiss.TimeUp(); })
        }

        huiPlayer.prototype.displayText = function(text,text2){
            clearTimeout(this.kRunTimeIn);
            clearTimeout(this.kRunTimeOut);

            document.getElementById('display_cen').style.opacity = 0;
            this.kRunTimeIn = setTimeout("document.getElementById('display_cen').style.opacity = 1;", 100);
            let x = document.getElementById('display_text').querySelectorAll('span');
            x[0].innerText = text;
            x[1].innerText = text2;
	        this.kRunTimeOut = setTimeout("document.getElementById('display_cen').style.opacity = 0;", 5000);
        }

        huiPlayer.prototype.findPos = function(el){
			let x = 0, y = 0;
			if(el.offsetParent){
				do {
					x += el.offsetLeft;
					y += el.offsetTop;
				} while (el = el.offsetParent);
			}
			return { x: x, y: y };
		};


        huiPlayer.prototype.secondToDate = function(result){
            let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
            let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
            return result = m + ":" + s;
        }

        huiPlayer.prototype.EncUnit = function(a){
            if(a>1024){
				var _a = a / 1024;
				if(_a>1024){
					return (_a / 1024).toFixed(2) + 'Gbps';
				}else{
					return _a.toFixed(2) + 'Mbps';
				}
			}else{
				return a.toFixed(2) + 'Kbps';
			}
        }

        huiPlayer.prototype.EncUnitS = function(a){
            if(a>1024){
				var _a = a / 1024;
				if(_a>1024){
					return (_a / 1024).toFixed(2) + 'Gb/s';
				}else{
					return _a.toFixed(2) + 'Mb/s';
				}
			}else{
				return a.toFixed(2) + 'Kb/s';
			}
        }

        huiPlayer.debugref = setInterval(() => {
            if(typeof this.frame_count != 'undefined' && typeof this.v_n != 'undefined'){
                let o = this.v_n.buffered;//.length - 1;
                let c = this.v_n.currentTime;
                let buffers = 0;

                for (var i = 0; i < o.length; i++) {
                    // 寻找当前时间之后最近的点
                    if (o.start(o.length - 1 - i) < c) {
                        buffers = o.end(o.length - 1 - i)
                        //console.log(o.end(o.length - 1 - i))
                        break;
                    }
                }
                
                this.frame_count[1].querySelectorAll('span')[1].innerText = this.v_n.videoWidth + " x " + this.v_n.videoHeight;
                this.frame_count[2].querySelectorAll('span')[1].innerText = this.EncUnit((this.v_n.webkitVideoDecodedByteCount * 8 / 1024) - (this.debuginfos.lastvdecode / 1024)) + "(" + this.EncUnitS((this.v_n.webkitVideoDecodedByteCount / 1024) - (this.debuginfos.lastvdecode / 8 / 1024)) +")";
                this.frame_count[3].querySelectorAll('span')[1].innerText = this.EncUnit((this.v_n.webkitAudioDecodedByteCount * 8 / 1024) - (this.debuginfos.lastadecode / 1024)) + "(" + this.EncUnitS((this.v_n.webkitAudioDecodedByteCount / 1024) - (this.debuginfos.lastadecode / 8 / 1024)) +")";
                this.frame_count[4].querySelectorAll('span')[1].innerText = this.v_n.webkitDecodedFrameCount - this.debuginfos.lastdec;
                this.frame_count[5].querySelectorAll('span')[1].innerText = this.v_n.webkitDecodedFrameCount + "/" + this.v_n.webkitDroppedFrameCount;
                this.frame_count[6].querySelectorAll('span')[1].innerText = (buffers - this.v_n.currentTime).toFixed(2) + "s";

                this.debuginfos.lastdec = this.v_n.webkitDecodedFrameCount;
                this.debuginfos.lastadecode = this.v_n.webkitAudioDecodedByteCount * 8;
                this.debuginfos.lastvdecode = this.v_n.webkitVideoDecodedByteCount * 8;
            }
        },1000)
    }
}