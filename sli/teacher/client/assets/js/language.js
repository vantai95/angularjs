'use strict';
/**
한글/영문 텍스트 
*/
$(document).ready(function(){
	initLanguage();
});

function initLanguage(){
	if( null == localStorage.getItem('sli_lang')){
		setLanguage("ko");
	}else{
		setLanguage(localStorage.getItem('sli_lang'));
	}
}
function setLanguage(currentLanguage) {	
  if('ko' == currentLanguage ){
	  $(".btn-ko").removeClass("btn-transparent").addClass("btn-borderPrimary");
	  $(".btn-en").removeClass("btn-borderPrimary").addClass("btn-transparent");
  }else{
	  $(".btn-en").removeClass("btn-transparent").addClass("btn-borderPrimary");
	  $(".btn-ko").removeClass("btn-borderPrimary").addClass("btn-transparent");
  }
  
  $('[data-langNum]').each(function() {
    var $this = $(this); 
    $this.html($.lang[currentLanguage][$this.data('langnum')]); 
  });    
}