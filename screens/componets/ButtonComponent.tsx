// components/ButtonComponent.tsx
import React from 'react';
import { Button } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
}

const ButtonComponent: React.FC<ButtonProps> = ({ title, onPress }) => (
  <Button title={title} onPress={onPress} />
);

export default ButtonComponent;
