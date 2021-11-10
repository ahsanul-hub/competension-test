const cetak = (n) => {
    let lines = ''
  
    lines += '\n'
    for(i = 0; i < n; i++){
      for(j = 0 ;j <i; j++){
        lines += ' '
      }
      if( i % 2 !== 0 ){
        for(k = n ; k > i ; k--){
        lines += '+ '
        }
      }
      else if( i == 2){
        for(k = n ; k > i ; k--){
        if(k % 2 != 0){
        lines += '+ '}
        else{
          lines += '# '
        }
      }
      }
      else{
      for(k = n ; k > i ; k--){
        if(k % 2 != 0){
        lines += '# '}
        else{
          lines += '+ '
        }
      }
      }
    
  
      lines += '\n'
    }
  
    console.log(lines)
  }
  
  cetak(5)
  