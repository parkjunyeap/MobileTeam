import { StyleSheet, Text, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRAY, PRIMARY } from '../colors';

export const KeyboardTypes = {
  DEFAULT: 'default',
  EMAIL: 'email-address',
};

export const ReturnKeyTypes = {
  DONE: 'done',
  NEXT: 'next',
};
export const InputTypes = {
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  PASSWORD_CONFIRM: 'PASSWORD_CONFIRM',
};

const PasswordProps = {
  keyboardType: 'default',
  secureTextEntry: true,
  iconName: { active: 'lock', inactive: 'lock-outline' },
};
const InputTypeProps = {
  EMAIL: {
    title: 'EMAIL',
    placeholder: 'your@email.com',
    KeyboardTypes: 'email-address',
    secureTextEntry: false,
    iconName: { active: 'email', inactive: 'email-outline' },
  },
  PASSWORD: {
    title: 'PASSWORD',
    placeholder: 'PASSWORD',
    ...PasswordProps, // 중복되는 값 따로 꺼냄
  },
  PASSWORD_CONFIRM: {
    title: 'PASSWORD CONFIRM',
    placeholder: 'PASSWORD CONFIRM',
    ...PasswordProps,
  },
};

const Input = forwardRef(({ inputType, styles, ...props }, ref) => {
  const {
    title,
    placeholder,
    keyboardType,
    secureTextEntry,
    iconName: { active, inactive },
  } = InputTypeProps[inputType];

  const { value } = props;

  const [isFocused, setIsFocused] = useState(false); // 포커스 상태에 따라 다른 아이콘을 사용하도록 포커스 상태 관리하는 상태변수래

  return (
    <View style={[defaultStyles.container, styles?.container]}>
      <Text
        style={[
          defaultStyles.title,
          { color: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK },
          styles?.title,
        ]}
      >
        {title}
      </Text>
      <View>
        <TextInput
          ref={ref}
          {...props}
          placeholder={placeholder}
          keyBoardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            defaultStyles.input,
            {
              borderColor: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
              color: value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK,
            },
            styles?.input,
          ]}
          textContentType="none"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <View style={(defaultStyles.icon, styles?.icon)}>
          <MaterialCommunityIcons // 아이콘 모음 리액트네이티브
            name={isFocused ? active : inactive} // 지금 선택했으면 active
            size={24}
            color={value || isFocused ? PRIMARY.DEFAULT : GRAY.DARK}
          />
        </View>
      </View>
    </View>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  // title: PropTypes.string,
  // iconName: PropTypes.string,
  inputType: PropTypes.oneOf(Object.values(InputTypes)).isRequired,
  value: PropTypes.string.isRequired,
  styles: PropTypes.object,
};

const defaultStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    marginBottom: 4,
    fontWeight: '700',
  },
  input: {
    borderBottomWidth: 1,
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 10,
    paddingLeft: 40,
  },
  icon: {
    position: 'absolute',
    left: 8,
    height: '100%',
    justifyContent: 'center',
  },
});

export default Input;
