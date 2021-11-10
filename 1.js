const totalInvest = (modal, time) =>{
    let modalawal = modal
    
    
  
    for(let i = 1 ; i <= time ; i++){
    const deposito = modalawal * 0.35 * 1.035
    const obligasi = modalawal * 0.65 * 0.30 * 1.13
    const sahamA = modalawal * 0.65 * 0.35 * 1.145
    const sahamB = modalawal* 0.65 * 0.35 * 1.125
    let profit = deposito + obligasi + sahamA + sahamB
    modalawal = profit
    }
    console.log(modalawal)
  }
  
  totalInvest(1000000000 , 2)