import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Input } from '@ant-design/react-native';
import { InputProps, TextAreaProps } from '@ant-design/react-native/lib/input/PropsType';

interface MyInputProps extends InputProps {
  variant?: "outlined" | "borderless" | "filled";
  textArea?: TextAreaProps;
  moreStyle?: ViewStyle; 
}

const MyInput: React.FC<MyInputProps> = (props: MyInputProps) => {
  if (props.textArea) {
    return (
      <Input.TextArea
        style={{
          padding: 10,
          borderRadius: 5,
          ...styles[props?.variant || "borderless"],
          ...props?.moreStyle
        }}
        {...props}
        {...props.textArea}
      />
    );
  }
  return (
    <Input
      style={{
        padding: 10,
        borderRadius: 5,
        height: 54,
        ...styles[props?.variant || "borderless"],
        ...props?.moreStyle
      }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  outlined: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderStyle: 'solid',
  },
  filled: {
    backgroundColor: '#f5f5f5',
  },
  borderless: {},
});

export default MyInput;