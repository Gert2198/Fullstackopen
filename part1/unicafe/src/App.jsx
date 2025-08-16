import { useState } from 'react'

const Button = ({text, onClick}) => 
  <button onClick={onClick}>
    {text}
  </button>

const Title = ({text}) => <h1>{text}</h1>

const StatsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Stats = ({good, neutral, bad}) => {
  const sum = good + neutral + bad
  if (sum === 0) return <>No feedback yet</>
  return (
    <table>
      <tbody>
        <StatsLine text='good' value={good} />
        <StatsLine text='neutral' value={neutral} />
        <StatsLine text='bad' value={bad} />
        <StatsLine text='all' value={sum} />
        <StatsLine text='average' value={(good - bad) / sum} />
        <StatsLine text='positive' value={`${100 * good / sum}%`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Title text='give feedback'/>
      <Button onClick={() => setGood(good+1)} text='good'/>
      <Button onClick={() => setNeutral(neutral+1)} text='neutral'/>
      <Button onClick={() => setBad(bad+1)} text='bad'/>
      <Title text='statistics'/>
      <Stats good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App