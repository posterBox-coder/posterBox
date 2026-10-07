import Typography from '@/components/ui/Typography';
import { useAppTheme } from '@/providers/theme-provider';
import { Pressable } from 'react-native';

const ToggleTheme = () => {
  const { mode, toggleTheme } = useAppTheme();

  return (
    <Pressable onPress={toggleTheme}>
      <Typography>{mode === 'light' ? 'Dark mode' : 'Light mode'}</Typography>
    </Pressable>
  );
};

export default ToggleTheme;