import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import useColor from '@/src/hooks/useColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Privacy } from '@/src/api/baseApiResponseModel/baseApiResponseModel';
import { usePostContext } from '@/src/context/post/usePostContext';
import { useAuth } from '@/src/context/auth/useAuth';
import Toast from 'react-native-toast-message';

const ObjectPostFeature = () => {
	const { localStrings } = useAuth();
	const { brandPrimary, backgroundColor } = useColor();
	const { savedPrivacy, setSavedPrivacy } = usePostContext();
	const [selectedOption, setSelectedOption] = useState<Privacy>(savedPrivacy || Privacy.PUBLIC);

	const handleSelect = (option: Privacy) => {
		setSelectedOption(option);
	};

	const handleSavePrivacy = () => {
		setSavedPrivacy!(selectedOption);
		router.back();
	};

	const options: {
		label: string;
		icon: any;
		description: string;
		value: Privacy;
	}[] = [
			{ label: localStrings.Public.Public, icon: 'globe', description: localStrings.ObjectPostPrivacy.PublicDescription, value: Privacy.PUBLIC },
			{ label: localStrings.Public.Friend, icon: 'people', description: localStrings.ObjectPostPrivacy.FriendDescription, value: Privacy.FRIEND_ONLY },
			{ label: localStrings.Public.Private, icon: 'lock-closed', description: localStrings.ObjectPostPrivacy.PrivateDescription, value: Privacy.PRIVATE },
		];

	return (
		<View style={{ flex: 1, backgroundColor: backgroundColor }}>
			{/* Header */}
			<View>
				<StatusBar barStyle="dark-content" />
				<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', height: 60, paddingBottom: 10 }}>
					<View style={{
						display: 'flex',
						flexDirection: 'row',
						paddingHorizontal: 10,
						alignItems: 'center',
						justifyContent: 'space-between',
					}}>
						<TouchableOpacity onPress={() => { router.back(); }}>
							<Ionicons name="close" size={24} color={brandPrimary} />
						</TouchableOpacity>

						<Text style={{
							fontWeight: 'bold',
							fontSize: 20,
							marginLeft: 10,
						}}>
							{localStrings.ObjectPostPrivacy.PostPrivacy}
						</Text>
					</View>
				</View>
			</View>
			<View style={{ borderBottomWidth: 1, borderColor: '#ccc', marginVertical: 10 }} />

			{/* Content */}
			<View style={{ flex: 1, paddingHorizontal: 10 }}>
				<Text style={{ fontWeight: 'bold', fontSize: 18 }}>{localStrings.ObjectPostPrivacy.Contents.WhoCanSee}</Text>
				<Text style={{ paddingTop: 10 }}>{localStrings.ObjectPostPrivacy.Contents.CanFind}</Text>
				<Text style={{ paddingTop: 10 }}>
					{localStrings.ObjectPostPrivacy.Contents.DefaultPrivacy1}<Text style={{ fontWeight: 'bold' }}>{localStrings.Public.Public}</Text>{localStrings.ObjectPostPrivacy.Contents.DefaultPrivacy2}
				</Text>
				<Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>{localStrings.ObjectPostPrivacy.ChoosePrivacy}</Text>
				<View style={styles.container}>
					{options.map((option) => (
						<TouchableOpacity
							key={option.label}
							style={styles.option}
							onPress={() => handleSelect(option.value)}
						>
							<View style={styles.checkbox}>
								{selectedOption === option.value && <Ionicons name="checkmark" size={20} color="#000" />}
							</View>
							<Ionicons name={option.icon} size={24} color={brandPrimary} style={styles.icon} />
							<View>
								<Text style={{ color: brandPrimary }}>{option.label}</Text>
								<Text style={{ color: '#888', fontSize: 12 }}>{option.description}</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* Footer */}
			<View style={{ paddingHorizontal: 10, paddingBottom: 20 }}>
				<TouchableOpacity
					style={{
						backgroundColor: brandPrimary,
						borderColor: brandPrimary,
						height: 45,
						borderRadius: 30,
						justifyContent: 'center',
						alignItems: 'center',
					}}
					onPress={handleSavePrivacy}
				>
					<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{localStrings.Public.Save}</Text>
				</TouchableOpacity>
			</View>
			<Toast />
		</View>
	);
}

export default ObjectPostFeature;

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5,
	},
	checkbox: {
		width: 24,
		height: 24,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	icon: {
		marginRight: 10,
	},
});
