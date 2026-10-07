// components/keyboard-wrapper.tsx
import Wrapper, { WrapperProps } from "@/components/utilities/Wrapper";
import { StyleProp, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

type KeyboardWrapperProps = WrapperProps & {
	bottomOffset?: number;
	contentContainerStyle?: StyleProp<ViewStyle>;
};

const KeyboardWrapper = ({
	children,
	bottomOffset = 20,
	contentContainerStyle,
	...wrapperProps
}: KeyboardWrapperProps) => {
	return (
		<Wrapper {...wrapperProps}>
			<KeyboardAwareScrollView
				bottomOffset={bottomOffset}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}>
				{children}
			</KeyboardAwareScrollView>
		</Wrapper>
	);
};

export default KeyboardWrapper;