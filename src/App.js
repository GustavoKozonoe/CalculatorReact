import React, {useState} from 'react';

import Display from './components/Display/Display';
import Button from './components/Button/Button';

import './CSS/App.css';

//git add . -> git commit -m 'mensagem' -> git push
//npm start
const App = (props) => 
{
  const [numbers, setNumbers] = useState(Array(props.numbers).fill(0))        // vetor que guardará os números da calculadora
  const [subNumbers, setSubNumbers] = useState(Array(props.numbers).fill("")) // vetor que guardará as operações anteriores

  const cleanNumbers = () => // função que limpa o vetor da calculadora
  { 
    const newArray = Array(props.numbers).fill(0)
    setNumbers(newArray)
  }
  
  const chooseValues = (newValue) => // Função que adiciona os números e as operações no vetor
  { 
    if(numbers[numbers.length-1] === 0 && typeof newValue === "number")
    { // IF que verifica se a ultima posição é igual a zero e se o novo elemento adicionado é um número
      setNumbers([newValue])
    }
    
    else if(numbers[numbers.length-1] === 0 && typeof newValue === "string")
    { // IF que verifica se a ultima posição é igual a zero e se o novo elemento adicionado é uma string
      if(newValue === ".") 
      { // se a string for um '.', ele adiciona no vetor, senão for ele não adiciona
        setNumbers([...numbers, newValue]) 
      }
    }
    
    else if(newValue === '+/-')
    { //IF para inverter o sinal do número
      let result = numbers[numbers.length-1] * -1 // Multiplica o número por -1
      numbers.pop() // Remove o valor antes de ser multiplicado
      setNumbers([...numbers, result]) 
    }
    else if(typeof newValue === "string" && typeof numbers[numbers.length-1] === "string")
    { //IF para não deixar repetir dois tipos de operações, verificando o último valor do vetor e novo valor que será inserido
      numbers.pop() // Remove a operação antiga
      setNumbers([...numbers, newValue])
    }
    else if(typeof newValue === "number" && typeof numbers[numbers.length-1] === "number")
    { //IF para caso tenha dois números seguidos, juntando os valores
      let result = 0
      result = String(numbers[numbers.length-1]) + String(newValue) // Transforma em string para poder juntar os números [7, 8] = [78]
      numbers.pop() // Remove o número antigo [7,8] -> [78]
      setNumbers([...numbers, parseFloat(result)])
    }
    else if(numbers[numbers.length-1] === ".")
    { //IF para juntar os números com ponto
      let result = 0
      result = String(numbers[numbers.length-2]) + '.' + String(newValue) // Junta os números [7,'.',8] -> [7.8]
      for(let i = 0; i < 2; i++) // E limpa os valores repetidos do vetor
        numbers.pop()
      setNumbers([...numbers, parseFloat(result)])
    }
    else
      setNumbers([...numbers, newValue])
  }

  const priorityOperations = (op) => // Função que recebe uma operação como parâmetro e realiza as contas na ordem correta
  {
    if(numbers.includes(op)) // IF que verifica se a operação está no vetor
    {
      let index = numbers.findIndex((type) => {return type === op}) // Acha o primeiro índice da operação recebida como parâmetro
      let result = 0
      if(numbers[index+1] !== undefined && op === '%')       // Caso a operação tenha todos os números (5 % 20 = 25)
        result = (numbers[index-1] * 100) / numbers[index+1] // Fará a operação 
      
      else if(numbers[index+1] === undefined && op === '%')  // Caso a operação não tenha o ultimo número da operação, será equivalente a fazer a operação só dividindo por 100
        result = numbers[index-1] / 100                      // Fará a operação 
      
      else if(numbers[index+1] !== undefined && op === '×')  // Caso a operação tenha todos os números (7 x 8 = 56)
        result = numbers[index-1] * numbers[index+1]         // Fará a operação 
      
      else if(numbers[index+1] === undefined && op === '×')  // Caso a operação não tenha o ultimo número da operação, será equivalente a fazer a operação por ele mesmo (7 x 7 = 49)
        result = numbers[index-1] * numbers[index-1]         // Fará a operação 
      
      else if(numbers[index+1] !== undefined && op === '÷')  // Caso a operação tenha todos os números (16 ÷ 8 = 2)
        result = numbers[index-1] / numbers[index+1]         // Fará a operação 
      
      else if(numbers[index+1] === undefined && op === '÷')  // Caso a operação não tenha o ultimo número da operação, será equivalente a fazer a operação por ele mesmo (7 ÷ 7 = 1)
        result = numbers[index-1] / numbers[index-1]         // Fará a operação 

      else if(numbers[index+1] !== undefined && op === '+')  // Caso a operação tenha todos os números (16 + 8 = 24)
        result = numbers[index-1] + numbers[index+1]         // Fará a operação 
      
      else if(numbers[index+1] === undefined && op === '+')  // Caso a operação não tenha o ultimo número da operação, será equivalente a fazer a operação por ele mesmo (7 + 7 = 14)
        result = numbers[index-1] + numbers[index-1]         // Fará a operação 
    
      else if(numbers[index+1] !== undefined && op === '-')  // Caso a operação tenha todos os números (16 - 8 = 8)
        result = numbers[index-1] - numbers[index+1]         // Fará a operação 
      
      else if(numbers[index+1] === undefined && op === '-')  // Caso a operação não tenha o ultimo número da operação, será equivalente a fazer a operação por ele mesmo (7 - 7 = 0)
        result = numbers[index-1] - numbers[index-1]         // Fará a operação 
    
      numbers.splice(index-1,2)                              // Recorta do vetor todos os números envolvidos menos 1
      numbers[index-1] = result                              // Troca o valor da operação que tinha sobrado pelo resultado da conta
    }
  }

  const createBackupArray = () => // Função para salvar a antiga operação
  {
    const newArray = Array(props.numbers).fill("")
    for(let i = 0; i < numbers.length; i++)
      newArray.push(numbers[i])
    
    setSubNumbers([newArray])
  }
  
  const doTheMath = () => // Função que é chamada ao apertar o botão de igual (=)
  {
    createBackupArray()
    for(let i = 0; i < numbers.length; i++)
    {
      if(numbers.includes('%')) // Já que porcentagem tem a prioridade sobre as outras, ela vai primeiro até não tiver mais nenhuma dela na conta 
      {
        priorityOperations('%')
        continue
      }
      else if(numbers.includes('×') || numbers.includes('÷')) // Após isso, multiplicação e divisão tem a prioridade
      {
        priorityOperations('×')
        priorityOperations('÷')
        continue
      }
      else // E por último, soma e subtração
      {
        priorityOperations('+') 
        priorityOperations('-')
      }
    }
    setNumbers([parseFloat(numbers[0].toFixed(2))]) // Coloca o resultado final como único elemento do vetor e controlando as casas após a virgula
  }

  return (
    <div className="main">
      <h1 className="ml2">Calculator</h1>
      <div className="Calculator">
        <div>
          <Display numbers={numbers} oldCalculation={subNumbers} />
        </div>
        <div className="buttons">
          <Button symbol="C" color="black" backgroundColor="#745FF2" onClicar={cleanNumbers} />
          <Button symbol="+/-" color="black" onClicar={chooseValues} />
          <Button symbol="%" color="black" onClicar={chooseValues} />
          <Button symbol="÷" onClicar={chooseValues} />

          <Button symbol={7} color="black" onClicar={chooseValues} />
          <Button symbol={8} color="black" onClicar={chooseValues} />
          <Button symbol={9} color="black" onClicar={chooseValues} />
          <Button symbol='×' onClicar={chooseValues} />

          <Button symbol={4} color="black" onClicar={chooseValues} />
          <Button symbol={5} color="black" onClicar={chooseValues} />
          <Button symbol={6} color="black" onClicar={chooseValues} />
          <Button symbol="-" onClicar={chooseValues} />

          <Button symbol={1} color="black" onClicar={chooseValues} />
          <Button symbol={2} color="black" onClicar={chooseValues} />
          <Button symbol={3} color="black" onClicar={chooseValues} />
          <Button symbol="+" onClicar={chooseValues} />
          
          <div className="zero">
            <Button symbol={0} color="black" width="10.3rem" onClicar={chooseValues} />
          </div>

          <Button symbol="." color="black" onClicar={chooseValues} />
          <Button symbol="=" color="black" backgroundColor="#745FF2" onClicar={doTheMath}  />
        </div>
      </div>
      <h2 className="ml2">Made by Gustavo Kozonoe</h2> 
    </div>
  );
}
export default App;