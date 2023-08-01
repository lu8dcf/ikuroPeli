/**
* PHP Email Form Validation - v3.6
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.formulario-notificacion');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
            
      if( ! action ) {
        displayError(thisForm, 'El formulario no se envio correctamente');
        return;
      }
      thisForm.querySelector('.loading').style.display = "flex";
      
      let formData = new FormData( thisForm );

      php_email_form_submit(thisForm, action, formData);
      
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {method: 'POST', body: formData, headers: {'X-Requested-With': 'XMLHttpRequest'}})
    .then(response => {
      if( response.ok ) {
        return response.text();
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').style.display = "none";
      thisForm.querySelector('.sent-message').style.display = "flex";
     
    })
    .catch((error) => {
      console.log("Error contacto:",error)
    });
  }

})();
