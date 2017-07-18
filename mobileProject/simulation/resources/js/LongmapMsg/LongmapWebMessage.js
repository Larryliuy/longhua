/**
 * 神州龙-web消息服务
 * @param host
 *            服务器地址
 * @param url
 *            连接地址
 */
var LongmapWebMessage = function(host, url){
	var websocket;
	
	/**
	 * 连接web消息服务器
	 */
	this.conn = function(message){
		if ('WebSocket' in window) {
			websocket = new WebSocket("ws://" + host + url);
		} else if ('MozWebSocket' in window) {
		    websocket = new MozWebSocket("ws://" + host
		        + url);
		} else {
		    websocket = new SockJS("http://" + host
		            + url+"2");
		}
		websocket.onopen = function(evnt) {
			message.success();
		};
		websocket.onerror = function(evnt) {
			message.connFail(evnt);
		};
		websocket.onclose = function(evnt) {
			message.connClose();
		}
		websocket.onmessage = function(event) {
			message.onMsg(event);
		};
	}
	
	/**
	 * 连接成功回调
	 */
	this.connSuccess = function(){};
	
	/**
	 * 连接失败回调
	 */
	this.connFail = function(evnt){};
	
	/**
	 * 连接关闭回调
	 */
	this.connClose = function(){};
	
	/**
	 * 收到消息回调
	 */
	this.onMsg = function(event){};
}


