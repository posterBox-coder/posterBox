import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Typography from "../ui/Typography";
// import { Colors } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
// import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import Icon from 'react-native-remix-icon';


const TopHeader = ({
	title,
	routeTo,
	actionBtn,
	onPress,
}: {
	title?: string;
	routeTo?: () => void;
	actionBtn?: React.ReactNode;
	onPress?: () => void;
	icon?: any;
}) => {
	const theme = useTheme();

	const handleRoute = () => {
		if (routeTo) {
			routeTo();
		} else {
			router.back();
		}
	};
	return (
		<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between",  }}>
			<Icon name="arrow-left-s-line" size={32} color={Colors[theme.mode].text} onPress={handleRoute} style={{ paddingRight: 20 }} />
			<Typography size={18} weight="600" textType="text" style={{ flex: 1, textAlign: "center" }}>
				{title}
			</Typography>

			{actionBtn ? (
				<TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ paddingLeft: 20, paddingVertical: 2 }}>
					{actionBtn}
				</TouchableOpacity>
			) : (
				<View style={{ width: 48 }}></View>
			)}
		</View>
	);
};

export default TopHeader;

export const TopHeader2 = ({ title, routeTo }: { title?: string; routeTo?: () => void }) => {
	const theme = useTheme();

	const handleRoute = () => {
		if (routeTo) {
			routeTo();
		} else {
			router.back();
		}
	};

	return (
		<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
			<Typography weight="600" size={18} lineHeight={27} textType="text">
				{title}
			</Typography>
			<TouchableOpacity onPress={handleRoute} style={{ paddingLeft: 24 }}>
				<Icon name="close-line" size={24} color={Colors[theme.mode].text} />
			</TouchableOpacity>
		</View>
	);
};
