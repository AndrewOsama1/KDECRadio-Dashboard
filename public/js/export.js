
document.addEventListener("DOMContentLoaded", function() {
  const exportForm = document.querySelector(".exportForm")
  const useMinMaxFields = ["age"]
  const inputs = {
    age: {
      from:{
        label: "more than",
        type: "number",
        placeholder: "0",
        min: 0,
        max: 150
      },
      to:{
        label: "less than",
        type: "number",
        placeholder: "150",
        min: 0,
        max: 150
      }
    },
    date: {
      from:{
        label: "from",
        type: "date",
      },
      to:{
        label: "to",
        type: "date",
      }
    }
  }
  exportForm.querySelector('select').onchange = e =>{
    exportForm.querySelector('.inputs').innerHTML = ''
    if (inputs[e.currentTarget.value]){
      let { from, to } = inputs[e.currentTarget.value]
      const fromLabel = document.createElement('label')
      const fromInput = document.createElement('input')
      const toLabel = document.createElement('label')
      const toInput = document.createElement('input')
      fromLabel.innerText = from.label
      toLabel.innerText = to.label
      fromInput.type = from.type
      fromInput.name = "from"
      fromInput.required = true
      toInput.type = to.type
      toInput.name = "to"
      toInput.required = true
      if (useMinMaxFields.includes(e.currentTarget.value)){
        fromInput.min = from.min
        fromInput.max = from.max
        fromInput.placeholder = from.placeholder
        toInput.min = to.min
        toInput.max = to.max
        toInput.placeholder = to.placeholder
      }
      fromLabel.append(fromInput)
      toLabel.append(toInput)
      exportForm.querySelector('.inputs').append(fromLabel)
      exportForm.querySelector('.inputs').append(toLabel)
    }
  }
})
