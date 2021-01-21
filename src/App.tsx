import { FC, useState } from 'react'

import { Mask } from './Mask'

const App: FC = () => {
  const [value, setValue] = useState<string>('')

  const onChange = (v: string) => {
    setValue(v)
  }

  return (
    <div>
      <Mask onChange={onChange} maskType="zip-code" />
      <p>Returned: {value}</p>
    </div>
  )
}

export default App
