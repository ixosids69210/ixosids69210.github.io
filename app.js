
        function copyToClipboard(text) {
            var elem = document.createElement('textarea');
            elem.value = text;
            document.body.appendChild(elem);
            elem.select();
            document.execCommand('copy');
            document.body.removeChild(elem);
            alert("链接已复制，快去导入吧！");
        }
		window.onload = function () {
			var overlay = document.createElement('div');
			overlay.className = 'overlay';

			var modal = document.createElement('div');
			modal.className = 'modal';

			var closeButton = document.createElement('button');
			closeButton.className = 'close-button';
			closeButton.innerHTML = '关闭';
			closeButton.addEventListener('click', function () {
				overlay.remove();
			});

			var text = document.createElement('p');
			text.innerHTML = '<a href="https://kepayun.live" target="_blank"> <span class="icon-container"><img src="anyi.svg" alt="Icon"></span>Kepa云⚡️ 付费推荐<br>9.9元100G，高速稳定不卡顿！</a><br><br><b>节点失效请联系我：<br>QQ:1287766992';
			modal.appendChild(text);

			modal.appendChild(closeButton);
			overlay.appendChild(modal);

			document.body.appendChild(overlay);
		}
