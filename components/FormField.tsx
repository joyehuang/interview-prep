import React from 'react'
import { FormControl } from './ui/form'
import { FormLabel } from './ui/form'
import { FormItem } from './ui/form'
import { Input } from './ui/input'
import { FormMessage } from './ui/form'
import { Controller, Control, FieldValues } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
    control: Control<T>
    name: string
    label: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = ({ control, name, label, placeholder, type="text"}: FormFieldProps<T>) => (
    <Controller
        name = {name}   
        control = {control}
        render = {({ field }) => (
                  <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                          <Input className="input" placeholder={placeholder} {...field} type={type} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )
          }
        />
)

export default FormField
