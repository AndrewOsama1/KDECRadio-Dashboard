const triggers = document.querySelectorAll(".trigger")

triggers.forEach(trigger => {
   trigger.addEventListener("click", ()=> {
      let target = trigger.getAttribute('modal-target')
      let modal = document.querySelector(`.modal-wrapper[modal='${target}']`)
      if (trigger.classList.contains('btn-open')){
         modal.classList.add("open")
         document.body.classList.add("modal-open")
      }
      if (trigger.classList.contains('btn-close')){
         modal.classList.remove("open")
         document.body.classList.remove("modal-open")
      }
   })
})
