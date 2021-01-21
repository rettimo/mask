import { FC, ChangeEvent, useState } from 'react'
import './Mask.css'

type maskType = 'phone' | 'credit-card' | 'zip-code' | 'time' | 'iban'

interface IMask {
  maskType: maskType
  masked?: boolean
  onChange: (value: string) => void
}

interface INormalizeReturn {
  maskedValue: string
  raw: string
}

/**
 * @param {string} value - current value in input before formatting
 * @returns an object containing strings with and without a mask
 */
const phoneNormalize = (value: string): INormalizeReturn => {
  let maskedValue = ''
  let raw = ''

  const phone = value.replace(/\D/g, '')
  const match = phone.match(/^(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/)

  if (match && value.length < 5 && value.length !== 3) {
    return {
      maskedValue: `+380 (${match[1]}`,
      raw: `380${match[1]}`,
    }
  }

  if (value.length === 3) {
    return {
      maskedValue: '',
      raw: '',
    }
  }

  if (match) {
    maskedValue = `+380${match[2] ? ' (' : ''}${match[2]}${
      match[3] ? ') ' : ''
    }${match[3]}${match[4] ? ' ' : ''}${match[4]}${match[5] ? ' ' : ''}${
      match[5]
    }`

    raw = `380${match[2] ? '' : ''}${match[2]}${match[3] ? '' : ''}${match[3]}${
      match[4] ? '' : ''
    }${match[4]}${match[5] ? '' : ''}${match[5]}`
  }

  return { maskedValue, raw }
}

/**
 * @param {string} value - current value in input before formatting
 * @returns an object containing strings with and without a mask
 */
const creditCardNormalize = (value: string): INormalizeReturn => {
  const maskedValue =
    value
      .replace(/[^\d]/g, '')
      .match(/.{1,4}/g)
      ?.join(' ') || ''

  const raw = value.replace(/[^\d]/g, '')

  return { maskedValue, raw }
}

/**
 * @param {string} value - current value in input before formatting
 * @returns an object containing strings with and without a mask
 */
const zipCodeNormalize = (value: string): INormalizeReturn => {
  const maskedValue = value.replace(/[^\d]/g, '')

  return { maskedValue, raw: maskedValue }
}

/**
 * @param {string} value - current value in input before formatting
 * @returns an object containing strings with and without a mask
 */
const timeNormalize = (value: string): INormalizeReturn => {
  const maskedValue =
    value
      .replace(/[^\d]/g, '')
      .match(/.{1,2}/g)
      ?.join(':') || ''

  const raw = maskedValue.split(':').join('')

  return {
    maskedValue,
    raw,
  }
}

/**
 * @param {string} value - current value in input before formatting
 * @returns an object containing strings with and without a mask
 */
const ibanNormalize = (value: string): INormalizeReturn => {
  let maskedValue = ''

  if (value.length < 3) {
    maskedValue = value.replace(/(\d*)/g, '').toString().toLocaleUpperCase()
  } else if (value.length < 35) {
    maskedValue =
      (value.slice(0, 2) + value.slice(2, 33).replace(/[^\d]/g, ''))
        .match(/.{1,4}/g)
        ?.join(' ') || ''
  }

  const raw = maskedValue.split(' ').join('')

  return { maskedValue, raw }
}

/**
 * @param {string} value - current value in input before formatting
 * @param {string} maskType - mask type for formatting
 * @returns an object containing strings with and without a mask
 */
const formatter = (value: string, maskType: maskType): INormalizeReturn => {
  switch (maskType) {
    case 'phone':
      return phoneNormalize(value)
    case 'credit-card':
      return creditCardNormalize(value)
    case 'zip-code':
      return zipCodeNormalize(value)
    case 'time':
      return timeNormalize(value)
    case 'iban':
      return ibanNormalize(value)
  }
}

const pattern = {
  phone: '+380 (00) 000 00 00',
  'credit-card': '0000 0000 0000 0000',
  'zip-code': '00000',
  time: '00:00:00',
  iban: 'AA00 0000 0000 0000 0000 0000 000',
}

/**
 * Renders a <Mask /> component
 * @param {(value: string) => void} props.onChange - a function that returns a formatted value to the parent component
 * @param {string} props.maskType - mask type for formatting
 * @param {boolean} props.masked - flag to return a string with or without a mask (optional, default false)
 */
export const Mask: FC<IMask> = ({ onChange, maskType, masked = false }) => {
  const [value, setValue] = useState('')

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { maskedValue, raw } = formatter(e.target.value, maskType)

    setValue(maskedValue)
    onChange(masked ? maskedValue : raw)
  }

  return (
    <input
      className={`mask ${
        value.length === pattern[maskType].length ? 'green' : 'red'
      }`}
      placeholder={pattern[maskType]}
      maxLength={pattern[maskType].length}
      value={value}
      onChange={handleChangeInput}
    />
  )
}
