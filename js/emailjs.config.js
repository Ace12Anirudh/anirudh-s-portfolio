// EmailJS config
// Replace the placeholder values with your actual EmailJS credentials.
// Do NOT commit real secrets if this repo is public.

window.EMAILJS_CONFIG = {
  PUBLIC_KEY: "oIP4dAamMMgllbUo7",
  SERVICE_ID: "service_7lfet8h",
  TEMPLATE_ID: "template_4sym7hw",
  DOWNLOAD_ID: "template_293wvmn"
};

(function initEmailJS(){
  try{
    if(window.emailjs && window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.PUBLIC_KEY){
      emailjs.init(window.EMAILJS_CONFIG.PUBLIC_KEY);
    }
  }catch(e){ console.warn("EmailJS init failed:", e); }
})();
