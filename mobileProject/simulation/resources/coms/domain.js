document.domain = 'longmap.com';
$('.search_back').click(function(){
	window.parent.closeSimulation();
	window.parent.sendToMap({type:"reset"})
});
window.addEventListener('message',onMessage,true);
function onMessage(msg){
	if(msg.origin == ''){
		console.log(msg.data);
	}
}
