// components/wrapper.tsx
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

export type WrapperProps = {
	children: React.ReactNode;
	noPadding?: boolean;
	edges?: Edge[];
	style?: StyleProp<ViewStyle>;
};

const Wrapper = ({
	children,
	noPadding = false,
	edges = ["top", "bottom", "left", "right"],
	style,
}: WrapperProps) => {
	return (
		<ThemedView style={{ flex: 1 }}>
			<SafeAreaView
				edges={edges}
				style={[{ flex: 1, paddingHorizontal: noPadding ? 0 : 16 }, style]}>
				{children}
			</SafeAreaView>
		</ThemedView>
	);
};

export default Wrapper;